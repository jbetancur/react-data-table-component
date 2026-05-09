import * as React from 'react';
import Head from './TableHead';
import HeadRow from './TableHeadRow';
import Column from './TableCol';
import ColumnCheckbox from './TableColCheckbox';
import ColumnExpander from './TableColExpander';
import { CellBase, buildCellStyle } from './Cell';
import { TableColumn, ColumnGroup } from '../types';
import { useHeadContext } from '../context/HeadContext';

interface DataTableHeadProps<T> {
	columns: TableColumn<T>[];
	columnGroups?: ColumnGroup[];
	selectableRows: boolean;
	expandableRows: boolean;
	expandableRowsHideExpander: boolean;
}

// ---------------------------------------------------------------------------
// Grid mode helpers — used when columnGroups are present.
// ---------------------------------------------------------------------------

/**
 * Builds the CSS grid-template-columns string from the visible column definitions.
 * Prefix columns (checkbox/expander) are always 48px.
 * columnWidths contains user-resized overrides and takes precedence.
 */
function buildGridTemplateColumns<T>(
	visibleColumns: TableColumn<T>[],
	prefixColCount: number,
	columnWidths: Record<string | number, number>,
): string {
	const tracks: string[] = [];
	for (let i = 0; i < prefixColCount; i++) tracks.push('48px');
	for (const col of visibleColumns) {
		const resized = col.id != null ? columnWidths[col.id] : undefined;
		if (resized != null) {
			tracks.push(`${resized}px`);
		} else if (col.width) {
			tracks.push(col.width);
		} else if (col.grow === 0 || col.button) {
			tracks.push(`minmax(${col.minWidth ?? '48px'}, max-content)`);
		} else {
			tracks.push(`minmax(${col.minWidth ?? '100px'}, ${col.grow ?? 1}fr)`);
		}
	}
	return tracks.join(' ');
}

/**
 * Builds the group label cells for row 1 of the CSS grid.
 * Rendered AFTER column header cells in the DOM so that the CSS + sibling
 * selector for column separators (rdt_cellBaseHead + rdt_cellBaseHead) is
 * not broken by group cells appearing between column cells in DOM order.
 * Visual placement is controlled entirely by gridColumn / gridRow.
 */
function buildGroupHeaderCells<T>(
	visibleColumns: TableColumn<T>[],
	columnGroups: ColumnGroup[],
	ungroupedIds: Set<string>,
	groupColSpans: Record<string, number>,
	prefixColCount: number,
): React.ReactNode[] {
	const cells: React.ReactNode[] = [];
	let colIdx = 0;

	while (colIdx < visibleColumns.length) {
		const col = visibleColumns[colIdx];
		const colId = String(col.id);

		if (ungroupedIds.has(colId)) {
			// Ungrouped column header spans both rows — no group label cell needed.
			colIdx++;
		} else {
			const group = columnGroups.find(g => g.columnIds.map(String).includes(colId));
			if (group) {
				const span = groupColSpans[String(group.name)] ?? 1;
				const gridColStart = prefixColCount + colIdx + 1;
				const gridColEnd = gridColStart + span;
				cells.push(
					<div
						key={String(group.name) + colIdx}
						className="rdt_groupCell"
						style={{
							gridColumn: `${gridColStart} / ${gridColEnd}`,
							gridRow: '1',
							...(group.align && group.align !== 'center'
								? { justifyContent: group.align === 'right' ? 'flex-end' : 'flex-start' }
								: undefined),
						}}
					>
						{group.name}
					</div>,
				);
				colIdx += span;
			} else {
				colIdx++;
			}
		}
	}
	return cells;
}

// ---------------------------------------------------------------------------
// Legacy flex-row helper — used when there are no columnGroups.
// ---------------------------------------------------------------------------
function buildGroupCells<T>(
	visibleColumns: TableColumn<T>[],
	columnGroups: ColumnGroup[],
	ungroupedIds: Set<string>,
	groupColSpans: Record<string, number>,
): React.ReactNode[] {
	const cells: React.ReactNode[] = [];
	let colIdx = 0;

	while (colIdx < visibleColumns.length) {
		const col = visibleColumns[colIdx];
		const colId = String(col.id);

		if (ungroupedIds.has(colId)) {
			cells.push(
				<div
					key={colId}
					className="rdt_cellBase rdt_cellBaseHead rdt_groupCell rdt_groupCellSpacer"
					style={buildCellStyle(col)}
				/>,
			);
			colIdx++;
		} else {
			const group = columnGroups.find(g => g.columnIds.map(String).includes(colId));
			if (group) {
				const span = groupColSpans[String(group.name)] ?? 1;
				const childCols = visibleColumns.slice(colIdx, colIdx + span);
				const totalGrow = childCols.reduce((sum, c) => {
					const s = buildCellStyle(c);
					return sum + (typeof s.flexGrow === 'number' ? s.flexGrow : 1);
				}, 0);
				const groupStyle: React.CSSProperties = childCols.every(c => c.width)
					? { flex: `0 0 ${childCols.reduce((sum, c) => sum + parseFloat(c.width!), 0)}px`, minWidth: 0 }
					: { flex: `${totalGrow} 0 0`, minWidth: 0 };

				cells.push(
					<div
						key={String(group.name) + colIdx}
						className="rdt_cellBase rdt_cellBaseHead rdt_groupCell"
						style={groupStyle}
					>
						{group.name}
					</div>,
				);
				colIdx += span;
			} else {
				colIdx++;
			}
		}
	}
	return cells;
}

function DataTableHead<T>({
	columns,
	columnGroups,
	selectableRows,
	expandableRows,
	expandableRowsHideExpander,
}: DataTableHeadProps<T>): JSX.Element {
	const {
		selectedColumn,
		sortDirection,
		sortIcon,
		sortServer,
		pagination,
		paginationServer,
		persistSelectedOnSort,
		selectableRowsVisibleOnly,
		showSelectAll,
		progressPending,
		sortedData,
		fixedHeader,
		dense,
		draggingColumnId,
		filterValues,
		columnWidths,
		resizable,
		onSort,
		onFilterChange,
		onResizeStart,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDragEnter,
		onDragLeave,
	} = useHeadContext<T>();

	const visibleColumns = columns.filter(c => !c.omit);
	const hasGroups = columnGroups && columnGroups.length > 0;

	// Count of non-omitted columns each group spans
	const groupColSpans = React.useMemo(() => {
		if (!columnGroups) return {};
		const map: Record<string, number> = {};
		for (const group of columnGroups) {
			map[String(group.name)] = group.columnIds.filter(id =>
				visibleColumns.some(c => String(c.id) === String(id)),
			).length;
		}
		return map;
	}, [columnGroups, visibleColumns]);

	// IDs of columns not covered by any group
	const ungroupedIds = React.useMemo(() => {
		if (!columnGroups) return new Set<string>();
		const covered = new Set(([] as (string | number)[]).concat(...columnGroups.map(g => g.columnIds)).map(String));
		return new Set(visibleColumns.map(c => String(c.id)).filter(id => !covered.has(id)));
	}, [columnGroups, visibleColumns]);

	const prefixColCount = (selectableRows ? 1 : 0) + (expandableRows && !expandableRowsHideExpander ? 1 : 0);

	// ── Shared column props ──────────────────────────────────────────────────
	const colProps = (column: TableColumn<T>) => ({
		column,
		selectedColumn,
		disabled: progressPending || sortedData.length === 0,
		pagination,
		paginationServer,
		persistSelectedOnSort,
		selectableRowsVisibleOnly,
		sortDirection,
		sortIcon,
		sortServer,
		filterValue: filterValues[column.id!] ?? '',
		resizedWidth: columnWidths[column.id!],
		onSort,
		onFilterChange,
		onResizeStart: resizable ? onResizeStart : undefined,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDragEnter,
		onDragLeave,
		draggingColumnId,
	});

	// ── CSS Grid layout (when columnGroups are present) ──────────────────────
	if (hasGroups) {
		const gridTemplateColumns = buildGridTemplateColumns(visibleColumns, prefixColCount, columnWidths);

		// Expander column index (1-based grid column)
		let expanderGridCol = 0;
		if (selectableRows) expanderGridCol = 2;
		else if (expandableRows && !expandableRowsHideExpander) expanderGridCol = 1;

		return (
			<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
				<div
					className={['rdt_headGrid', dense && 'rdt_headGridDense'].filter(Boolean).join(' ')}
					role="presentation"
					style={{ gridTemplateColumns }}
				>
					{/* ── Prefix cells — span both grid rows ── */}
					{selectableRows && (
						<div style={{ gridColumn: '1', gridRow: '1 / span 2', display: 'flex', alignItems: 'stretch' }}>
							{showSelectAll ? <CellBase style={{ flex: '0 0 48px', width: '100%' }} /> : <ColumnCheckbox />}
						</div>
					)}
					{expandableRows && !expandableRowsHideExpander && (
						<div
							style={{
								gridColumn: String(expanderGridCol),
								gridRow: '1 / span 2',
								display: 'flex',
								alignItems: 'stretch',
							}}
						>
							<ColumnExpander />
						</div>
					)}

					{/*
					 * ── Column header cells ──
					 * Rendered BEFORE group label cells in the DOM so that the CSS adjacent-
					 * sibling selector (.rdt_cellBaseHead + .rdt_cellBaseHead::before) is not
					 * broken by group cells appearing between column cells in DOM order.
					 * Visual placement is controlled entirely by gridColumn / gridRow.
					 */}
					{visibleColumns.map((column, visIdx) => {
						const gridCol = prefixColCount + visIdx + 1;
						const isUngrouped = ungroupedIds.has(String(column.id));
						// In grid mode the track width controls layout — resizedWidth inline styles
						// would conflict with grid-template-columns, so we strip it here.
						const { resizedWidth: _skip, ...rest } = colProps(column);
						return (
							<Column
								key={column.id}
								{...rest}
								gridStyle={{
									gridColumn: String(gridCol),
									gridRow: isUngrouped ? '1 / span 2' : '2',
								}}
							/>
						);
					})}

					{/* ── Group label cells (row 1) — rendered last in DOM ── */}
					{buildGroupHeaderCells(visibleColumns, columnGroups!, ungroupedIds, groupColSpans, prefixColCount)}
				</div>
			</Head>
		);
	}

	// ── Standard two-row flex layout (no columnGroups) ──────────────────────
	return (
		<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
			{hasGroups && (
				<HeadRow className="rdt_TableHeadRow rdt_groupRow" role="row" $dense={dense}>
					{prefixColCount > 0 && (
						<div
							className="rdt_cellBase rdt_cellBaseHead rdt_groupCell rdt_groupCellSpacer"
							style={{ flex: `0 0 ${prefixColCount * 48}px`, minWidth: `${prefixColCount * 48}px` }}
						/>
					)}
					{buildGroupCells(visibleColumns, columnGroups!, ungroupedIds, groupColSpans)}
				</HeadRow>
			)}
			<HeadRow className="rdt_TableHeadRow" role="row" $dense={dense}>
				{selectableRows && (showSelectAll ? <CellBase style={{ flex: '0 0 48px' }} /> : <ColumnCheckbox />)}

				{expandableRows && !expandableRowsHideExpander && <ColumnExpander />}

				{columns.map(column => (
					<Column key={column.id} {...colProps(column)} />
				))}
			</HeadRow>
		</Head>
	);
}

export default DataTableHead;
