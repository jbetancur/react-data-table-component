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
// Helper — builds the ordered list of group-row cells. Pure function, no hooks.
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

				// Sum flex-grow across child columns so the group header aligns exactly.
				const totalGrow = childCols.reduce((sum, c) => {
					const s = buildCellStyle(c);
					return sum + (typeof s.flexGrow === 'number' ? s.flexGrow : 1);
				}, 0);

				// For fully fixed-width groups, sum the pixel values instead.
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

// ---------------------------------------------------------------------------

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
					<Column
						key={column.id}
						column={column}
						selectedColumn={selectedColumn}
						disabled={progressPending || sortedData.length === 0}
						pagination={pagination}
						paginationServer={paginationServer}
						persistSelectedOnSort={persistSelectedOnSort}
						selectableRowsVisibleOnly={selectableRowsVisibleOnly}
						sortDirection={sortDirection}
						sortIcon={sortIcon}
						sortServer={sortServer}
						filterValue={filterValues[column.id!] ?? ''}
						resizedWidth={columnWidths[column.id!]}
						onSort={onSort}
						onFilterChange={onFilterChange}
						onResizeStart={resizable ? onResizeStart : undefined}
						onDragStart={onDragStart}
						onDragOver={onDragOver}
						onDragEnd={onDragEnd}
						onDragEnter={onDragEnter}
						onDragLeave={onDragLeave}
						draggingColumnId={draggingColumnId}
					/>
				))}
			</HeadRow>
		</Head>
	);
}

export default DataTableHead;
