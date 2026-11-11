import React from 'react';
import {
	useColumns,
	useTableState,
	useTableData,
	useColumnFilter,
	SortOrder,
	type TableColumn,
	type FilterState,
} from 'react-data-table-component/headless';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const rawColumns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'dept', name: 'Department', selector: r => r.department, sortable: true },
	{ id: 'salary', name: 'Salary', selector: r => r.salary, sortable: true },
];

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000 },
	{ id: 7, name: 'Casey Morgan', department: 'HR', salary: 88000 },
	{ id: 8, name: 'Alex Kim', department: 'Engineering', salary: 162000 },
	{ id: 9, name: 'Morgan Lee', department: 'Design', salary: 109000 },
	{ id: 10, name: 'Drew Park', department: 'Analytics', salary: 99000 },
	{ id: 11, name: 'Riley Nguyen', department: 'Engineering', salary: 134000 },
	{ id: 12, name: 'Jamie Okafor', department: 'Engineering', salary: 141000 },
];

const SortArrow = ({ dir }: { dir: 'asc' | 'desc' | null }) => {
	if (!dir) return <span style={{ opacity: 0.2 }}>↕</span>;
	return <span>{dir === 'asc' ? '↑' : '↓'}</span>;
};

export default function HeadlessDemo() {
	// 1. Column order + default sort
	const { tableColumns, defaultSortColumn, defaultSortDirection } = useColumns<Employee>(rawColumns, {
		defaultSortFieldId: 'name',
	});

	// 2. Sort / page / selection state. Everything except `data` is optional.
	const { tableState, handleSort, handleChangePage, handleChangeRowsPerPage } = useTableState<Employee>({
		data,
		defaultSortColumn,
		defaultSortDirection,
		paginationPerPage: 5,
	});

	const { selectedColumn, sortDirection, sortColumns, currentPage, rowsPerPage } = tableState;

	// 3. Sorted rows. Pagination is left off here so the filter below sees every row.
	const { sortedData } = useTableData<Employee>({
		data,
		selectedColumn,
		sortDirection,
		sortColumns,
		currentPage,
		rowsPerPage,
	});

	// 4. Filter the full sorted set, then slice the page. Slicing first would only
	//    ever match rows on the current page.
	const { filterValues, handleFilterChange, filteredData } = useColumnFilter<Employee>(tableColumns);
	const filteredRows = filteredData(sortedData);
	const rows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

	function clickSort(col: TableColumn<Employee>) {
		if (!col.sortable) return;
		const isAsc = selectedColumn?.id === col.id && tableState.sortDirection === SortOrder.ASC;
		handleSort({
			type: 'SORT_CHANGE',
			selectedColumn: col,
			clearSelectedOnSort: false,
			additive: false,
			defaultSortDirection: SortOrder.ASC,
			direction: isAsc ? SortOrder.DESC : SortOrder.ASC,
		});
	}

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
			<p style={{ marginBottom: 8, fontSize: 11, color: '#6b7280', fontStyle: 'italic' }}>
				Custom markup. No DataTable component used. All logic from the four headless hooks.
			</p>

			{/* Filter inputs */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
				{tableColumns.map(col => (
					<input
						key={col.id}
						placeholder={`Filter ${col.name}…`}
						value={(filterValues[col.id!] as FilterState | undefined)?.condition1?.value ?? ''}
						onChange={e => {
							handleFilterChange(col.id!, { condition1: { operator: 'contains', value: e.target.value } });
							// A narrower result set may not reach the current page.
							handleChangePage(1);
						}}
						style={{
							flex: 1,
							padding: '4px 8px',
							fontSize: 12,
							border: '1px solid #e5e7eb',
							borderRadius: 6,
							outline: 'none',
						}}
					/>
				))}
			</div>

			{/* Custom table markup */}
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ background: '#f8fafc' }}>
						{tableColumns.map(col => {
							const isActive = selectedColumn?.id === col.id;
							return (
								<th
									key={col.id}
									onClick={() => clickSort(col)}
									style={{
										padding: '8px 12px',
										textAlign: 'left',
										fontWeight: 600,
										fontSize: 11,
										textTransform: 'uppercase',
										letterSpacing: '0.05em',
										color: isActive ? '#4f46e5' : '#374151',
										cursor: col.sortable ? 'pointer' : 'default',
										userSelect: 'none',
										borderBottom: '2px solid',
										borderBottomColor: isActive ? '#4f46e5' : '#e5e7eb',
									}}
								>
									{col.name}{' '}
									{col.sortable && <SortArrow dir={isActive ? (sortDirection === 'asc' ? 'asc' : 'desc') : null} />}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 && (
						<tr>
							<td colSpan={tableColumns.length} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>
								No results
							</td>
						</tr>
					)}
					{rows.map((row, i) => (
						<tr
							key={row.id}
							style={{
								background: i % 2 === 0 ? '#fff' : '#f9fafb',
								borderBottom: '1px solid #f3f4f6',
							}}
						>
							{tableColumns.map(col => (
								<td key={col.id} style={{ padding: '8px 12px', color: '#1f2937' }}>
									{col.id === 'salary' ? `$${row.salary.toLocaleString()}` : String(col.selector?.(row) ?? '')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{/* Custom pagination controls */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginTop: 12,
					fontSize: 12,
					color: '#6b7280',
				}}
			>
				<span>
					Page {currentPage} of {totalPages} &middot; {filteredRows.length} of {data.length} rows
				</span>
				<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<span>Rows per page:</span>
					<select
						value={rowsPerPage}
						onChange={e => handleChangeRowsPerPage(Number(e.target.value), filteredRows.length)}
						style={{ border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 4px', fontSize: 12 }}
					>
						{[5, 10].map(n => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
					<button
						onClick={() => handleChangePage(currentPage - 1)}
						disabled={currentPage <= 1}
						style={{
							padding: '2px 8px',
							border: '1px solid #e5e7eb',
							borderRadius: 4,
							cursor: 'pointer',
							background: '#fff',
							opacity: currentPage <= 1 ? 0.4 : 1,
						}}
					>
						‹
					</button>
					<button
						onClick={() => handleChangePage(currentPage + 1)}
						disabled={currentPage >= totalPages}
						style={{
							padding: '2px 8px',
							border: '1px solid #e5e7eb',
							borderRadius: 4,
							cursor: 'pointer',
							background: '#fff',
							opacity: currentPage >= totalPages ? 0.4 : 1,
						}}
					>
						›
					</button>
				</div>
			</div>
		</div>
	);
}
