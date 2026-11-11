import {
	useColumns,
	useTableState,
	useTableData,
	useColumnFilter,
	SortOrder,
	type TableColumn,
} from 'react-data-table-component/headless';

type Status = 'Paid' | 'Pending' | 'Overdue';

interface Invoice {
	id: number;
	customer: string;
	plan: string;
	status: Status;
	amount: number;
}

const columns: TableColumn<Invoice>[] = [
	{ id: 'customer', name: 'Customer', selector: row => row.customer, sortable: true },
	{ id: 'plan', name: 'Plan', selector: row => row.plan, sortable: true },
	{ id: 'status', name: 'Status', selector: row => row.status, sortable: true },
	{ id: 'amount', name: 'Amount', selector: row => row.amount, sortable: true, right: true },
];

const data: Invoice[] = [
	{ id: 1001, customer: 'Northwind Labs', plan: 'Team', status: 'Paid', amount: 480 },
	{ id: 1002, customer: 'Juniper & Co', plan: 'Starter', status: 'Pending', amount: 96 },
	{ id: 1003, customer: 'Harbor Freight Studio', plan: 'Enterprise', status: 'Paid', amount: 2400 },
	{ id: 1004, customer: 'Bluebird Bakery', plan: 'Starter', status: 'Overdue', amount: 96 },
	{ id: 1005, customer: 'Atlas Cartography', plan: 'Team', status: 'Paid', amount: 480 },
	{ id: 1006, customer: 'Quill Press', plan: 'Team', status: 'Pending', amount: 520 },
	{ id: 1007, customer: 'Saltwater Outfitters', plan: 'Enterprise', status: 'Overdue', amount: 3100 },
	{ id: 1008, customer: 'Maple Street Dental', plan: 'Starter', status: 'Paid', amount: 120 },
	{ id: 1009, customer: 'Ironwood Robotics', plan: 'Enterprise', status: 'Paid', amount: 2750 },
	{ id: 1010, customer: 'Lantern Books', plan: 'Starter', status: 'Pending', amount: 96 },
	{ id: 1011, customer: 'Copperline Coffee', plan: 'Team', status: 'Paid', amount: 480 },
	{ id: 1012, customer: 'Tidewater Analytics', plan: 'Enterprise', status: 'Pending', amount: 2400 },
	{ id: 1013, customer: 'Fernhill Nursery', plan: 'Starter', status: 'Overdue', amount: 120 },
	{ id: 1014, customer: 'Osprey Aviation', plan: 'Team', status: 'Paid', amount: 560 },
];

const statusBadge: Record<Status, string> = {
	Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
	Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
	Overdue: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const checkboxClass = 'size-4 rounded border-gray-300 accent-blue-600';
const pagerButtonClass =
	'rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40';

export default function HeadlessTailwindDemo() {
	// 1. Column order + default sort
	const { tableColumns, defaultSortColumn, defaultSortDirection } = useColumns(columns, {
		defaultSortFieldId: 'customer',
	});

	// 2. Sort, page, and selection state
	const {
		tableState,
		handleSort,
		handleChangePage,
		handleChangeRowsPerPage,
		handleSelectedRow,
		handleSelectAllRows,
		handleClearSelectedRows,
	} = useTableState({ data, defaultSortColumn, defaultSortDirection, paginationPerPage: 5 });

	const { selectedColumn, sortDirection, sortColumns, currentPage, rowsPerPage, selectedRows, allSelected } =
		tableState;

	// 3. Sorted rows
	const { sortedData } = useTableData({ data, selectedColumn, sortDirection, sortColumns, currentPage, rowsPerPage });

	// 4. Filter the full sorted set, then slice the page
	const { filterValues, handleFilterChange, filteredData } = useColumnFilter(tableColumns);
	const filteredRows = filteredData(sortedData);
	const rows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
	const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

	const search = filterValues.customer?.condition1.value ?? '';
	const status = filterValues.status?.condition1.value ?? '';

	// A filter changes which rows "select all" covers and how many pages there are,
	// so start both over.
	function applyFilter(columnId: string, operator: 'contains' | 'equals', value: string) {
		handleFilterChange(columnId, { condition1: { operator, value } });
		handleClearSelectedRows();
		handleChangePage(1);
	}

	const isSelected = (row: Invoice) => selectedRows.some(selected => selected.id === row.id);
	const someSelected = selectedRows.length > 0 && !allSelected;
	const selectedTotal = selectedRows.reduce((sum, row) => sum + row.amount, 0);

	return (
		<div className="text-sm text-gray-900">
			{/* Toolbar */}
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<input
					type="search"
					value={search}
					onChange={e => applyFilter('customer', 'contains', e.target.value)}
					placeholder="Search customers…"
					aria-label="Search customers"
					className="w-56 rounded-md border border-gray-300 px-3 py-1.5 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
				/>
				<select
					value={status}
					onChange={e => applyFilter('status', 'equals', e.target.value)}
					aria-label="Filter by status"
					className="rounded-md border border-gray-300 bg-white px-2 py-1.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
				>
					<option value="">All statuses</option>
					<option value="Paid">Paid</option>
					<option value="Pending">Pending</option>
					<option value="Overdue">Overdue</option>
				</select>
				<p className="ml-auto text-xs text-gray-500" aria-live="polite">
					{selectedRows.length > 0
						? `${selectedRows.length} selected · ${money.format(selectedTotal)}`
						: `${filteredRows.length} of ${data.length} invoices`}
				</p>
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-lg border border-gray-200">
				<table className="w-full border-collapse text-left">
					<thead className="bg-gray-50 text-xs font-semibold tracking-wide text-gray-600 uppercase">
						<tr>
							<th scope="col" className="w-10 px-3 py-2.5">
								<input
									type="checkbox"
									aria-label="Select all invoices"
									className={checkboxClass}
									checked={allSelected}
									ref={el => {
										if (el) el.indeterminate = someSelected;
									}}
									disabled={filteredRows.length === 0}
									onChange={() =>
										handleSelectAllRows({
											type: 'SELECT_ALL_ROWS',
											keyField: 'id',
											rows: filteredRows,
											rowCount: filteredRows.length,
											mergeSelections: false,
										})
									}
								/>
							</th>
							{tableColumns.map(col => {
								const isSorted = selectedColumn.id === col.id;
								const ariaSort = !isSorted ? 'none' : sortDirection === SortOrder.ASC ? 'ascending' : 'descending';

								return (
									<th
										key={col.id}
										scope="col"
										aria-sort={ariaSort}
										className={col.right ? 'px-3 py-2.5 text-right' : 'px-3 py-2.5'}
									>
										<button
											type="button"
											onClick={() =>
												handleSort({
													type: 'SORT_CHANGE',
													selectedColumn: col,
													clearSelectedOnSort: false,
													additive: false,
													defaultSortDirection: SortOrder.ASC,
												})
											}
											className="inline-flex items-center gap-1 rounded uppercase hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
										>
											{col.name}
											<span aria-hidden="true" className={isSorted ? 'text-blue-600' : 'text-gray-300'}>
												{isSorted && sortDirection === SortOrder.DESC ? '↓' : '↑'}
											</span>
										</button>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{rows.length === 0 && (
							<tr>
								<td colSpan={tableColumns.length + 1} className="px-3 py-8 text-center text-gray-400">
									No invoices match these filters.
								</td>
							</tr>
						)}
						{rows.map(row => {
							const selected = isSelected(row);

							return (
								<tr key={row.id} className={selected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
									<td className="px-3 py-2.5">
										<input
											type="checkbox"
											aria-label={`Select ${row.customer}`}
											className={checkboxClass}
											checked={selected}
											onChange={() =>
												handleSelectedRow({
													type: 'SELECT_SINGLE_ROW',
													keyField: 'id',
													row,
													isSelected: selected,
													rowCount: filteredRows.length,
													singleSelect: false,
												})
											}
										/>
									</td>
									<td className="px-3 py-2.5 font-medium">{row.customer}</td>
									<td className="px-3 py-2.5 text-gray-600">{row.plan}</td>
									<td className="px-3 py-2.5">
										<span
											className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadge[row.status]}`}
										>
											{row.status}
										</span>
									</td>
									<td className="px-3 py-2.5 text-right tabular-nums">{money.format(row.amount)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
				<label className="flex items-center gap-2">
					Rows per page
					<select
						value={rowsPerPage}
						onChange={e => handleChangeRowsPerPage(Number(e.target.value), filteredRows.length)}
						className="rounded-md border border-gray-300 bg-white px-1.5 py-1"
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
					</select>
				</label>
				<div className="flex items-center gap-2">
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<button
						type="button"
						className={pagerButtonClass}
						onClick={() => handleChangePage(currentPage - 1)}
						disabled={currentPage <= 1}
					>
						Previous
					</button>
					<button
						type="button"
						className={pagerButtonClass}
						onClick={() => handleChangePage(currentPage + 1)}
						disabled={currentPage >= totalPages}
					>
						Next
					</button>
				</div>
			</div>

			{/* State readout */}
			<div className="mt-3 overflow-x-auto rounded-md bg-gray-50 px-3 py-2 font-mono text-xs whitespace-nowrap text-gray-600">
				{JSON.stringify({
					sort: selectedColumn.id ? `${selectedColumn.id} ${sortDirection}` : null,
					filters: { customer: search, status },
					page: currentPage,
					selected: selectedRows.map(row => row.id),
				})}
			</div>
		</div>
	);
}
