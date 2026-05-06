import * as React from 'react';
import Head from './TableHead';
import HeadRow from './TableHeadRow';
import Column from './TableCol';
import ColumnCheckbox from './TableColCheckbox';
import ColumnExpander from './TableColExpander';
import { CellBase } from './Cell';
import { TableColumn, ColumnGroup } from '../types';
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

	// Build a colSpan map: groupId → count of non-omitted columns in that group
	const groupColSpans = React.useMemo(() => {
		if (!columnGroups) return {};
		const map: Record<string, number> = {};
		for (const group of columnGroups) {
			const count = group.columnIds.filter(id => visibleColumns.some(c => String(c.id) === String(id))).length;
			map[String(group.name)] = count;
		}
		return map;
	}, [columnGroups, visibleColumns]);

	// Columns not covered by any group get their own implicit single-column group cell
	const ungroupedIds = React.useMemo(() => {
		if (!columnGroups) return new Set<string>();
		const covered = new Set(columnGroups.flatMap(g => g.columnIds.map(String)));
		return new Set(visibleColumns.map(c => String(c.id)).filter(id => !covered.has(id)));
	}, [columnGroups, visibleColumns]);

	const checkboxColCount = (selectableRows && !showSelectAll) || (selectableRows && showSelectAll) ? 1 : 0;
	const expanderColCount = expandableRows && !expandableRowsHideExpander ? 1 : 0;
	const prefixColCount = checkboxColCount + expanderColCount;

	return (
		<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
			{hasGroups && (
				<HeadRow className="rdt_TableHeadRow rdt_groupRow" role="row" $dense={dense}>
					{/* Prefix spacers for checkbox/expander columns */}
					{prefixColCount > 0 && (
						<div
							className="rdt_cellBase rdt_cellBaseHead rdt_groupCell rdt_groupCellSpacer"
							style={{ flex: `0 0 ${prefixColCount * 48}px`, minWidth: `${prefixColCount * 48}px` }}
						/>
					)}
					{/* Render group cells in column order */}
					{(() => {
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
										style={{ flex: '1 0 0', minWidth: '100px' }}
									/>,
								);
								colIdx++;
							} else {
								// Find which group this column belongs to
								const group = columnGroups!.find(g => g.columnIds.map(String).includes(colId));
								if (group) {
									const span = groupColSpans[String(group.name)] ?? 1;
									cells.push(
										<div
											key={String(group.name) + colIdx}
											className="rdt_cellBase rdt_cellBaseHead rdt_groupCell"
											style={{ flex: `${span} 0 0`, minWidth: `${span * 100}px` }}
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
					})()}
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
