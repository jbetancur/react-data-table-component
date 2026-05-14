import * as React from 'react';
import Head from './TableHead';
import HeadRow from './TableHeadRow';
import Column from './TableCol';
import ColumnCheckbox from './TableColCheckbox';
import ColumnExpander from './TableColExpander';
import { CellBase } from './Cell';
import { buildGridTemplateColumns, buildGroupHeaderCells, type GroupDragProps } from './dataTableHeadHelpers';
import type { TableColumn, ColumnGroup } from '../types';
import { emptyFilterState } from '../hooks/useColumnFilter';
import { useHeadContext } from '../context/HeadContext';

interface DataTableHeadProps<T> {
	columns: TableColumn<T>[];
	columnGroups?: ColumnGroup[];
	selectableRows: boolean;
	expandableRows: boolean;
	expandableRowsHideExpander: boolean;
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
		draggingGroupKey,
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
		onGroupDragStart,
		onGroupDragEnter,
		onGroupDragOver,
		onGroupDragEnd,
	} = useHeadContext<T>();

	const groupDragProps: GroupDragProps = {
		draggingGroupKey,
		onGroupDragStart,
		onGroupDragEnter,
		onGroupDragOver,
		onGroupDragEnd,
	};

	const visibleColumns = columns.filter(c => !c.omit);
	const hasGroups = columnGroups && columnGroups.length > 0;

	// ── FLIP animation for column/group reorder ──────────────────────────────
	const containerRef = React.useRef<HTMLDivElement>(null);
	const savedPositions = React.useRef<Map<string, number>>(new Map());
	const isMounted = React.useRef(false);
	const columnOrder = React.useMemo(() => visibleColumns.map(c => c.id).join(','), [visibleColumns]);
	const groupOrder = React.useMemo(() => (columnGroups ?? []).map(g => g.columnIds[0]).join(','), [columnGroups]);

	React.useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const animate = isMounted.current;
		isMounted.current = true;

		const tryFlip = (el: HTMLElement, key: string) => {
			const newLeft = el.getBoundingClientRect().left;
			const prevLeft = savedPositions.current.get(key);
			savedPositions.current.set(key, newLeft);
			if (!animate || reducedMotion || prevLeft == null || Math.abs(prevLeft - newLeft) < 1) return;

			const delta = prevLeft - newLeft;
			el.style.transform = `translateX(${delta}px)`;
			el.style.transition = 'none';
			el.getBoundingClientRect(); // force reflow
			el.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
			el.style.transform = '';
			const onEnd = () => {
				el.style.transform = '';
				el.style.transition = '';
				el.removeEventListener('transitionend', onEnd);
			};
			el.addEventListener('transitionend', onEnd);
		};

		container.querySelectorAll<HTMLElement>('[data-column-id]').forEach(el => {
			tryFlip(el, `col:${el.dataset.columnId}`);
		});
		container.querySelectorAll<HTMLElement>('[data-group-key]').forEach(el => {
			tryFlip(el, `grp:${el.dataset.groupKey}`);
		});

		const positions = savedPositions.current;
		const mounted = isMounted;

		return () => {
			mounted.current = false;
			positions.clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnOrder, groupOrder]);

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
		filterValue: filterValues[column.id!] ?? emptyFilterState(column.filterType),
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
					ref={containerRef}
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
					{buildGroupHeaderCells(
						visibleColumns,
						columnGroups!,
						ungroupedIds,
						groupColSpans,
						prefixColCount,
						groupDragProps,
					)}
				</div>
			</Head>
		);
	}

	// ── Standard flex layout (no columnGroups) ──────────────────────────────
	return (
		<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
			<HeadRow ref={containerRef} className="rdt_TableHeadRow" role="row" $dense={dense}>
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
