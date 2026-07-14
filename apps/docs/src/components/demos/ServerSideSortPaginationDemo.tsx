import { useState, useEffect, useCallback } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, SortOrder } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

const DB: Employee[] = Array.from({ length: 150 }, (_, i) => ({
	id: i + 1,
	name: [
		'Aria Chen',
		'Marcus Webb',
		'Priya Kapoor',
		'Jordan Ellis',
		'Sam Rivera',
		'Taylor Brooks',
		'Casey Morgan',
		'Alex Kim',
		'Morgan Lee',
		'Drew Park',
		'Riley Nguyen',
		'Jamie Okafor',
		'Quinn Zhang',
		'Avery Patel',
		'Blake Russo',
	][i % 15],
	department: ['Engineering', 'Product', 'Design', 'Analytics', 'Sales', 'HR'][i % 6],
	salary: 75000 + ((i * 1237) % 90000),
	status: ['Active', 'Remote', 'On Leave', 'Contractor'][i % 4],
}));

async function fakeFetch(params: {
	page: number;
	perPage: number;
	sortField: string;
	sortDir: SortOrder;
}): Promise<{ rows: Employee[]; total: number }> {
	await new Promise(r => setTimeout(r, 300));

	const sorted = [...DB].sort((a, b) => {
		const av = a[params.sortField as keyof Employee] as string | number;
		const bv = b[params.sortField as keyof Employee] as string | number;
		if (av < bv) return params.sortDir === SortOrder.ASC ? -1 : 1;
		if (av > bv) return params.sortDir === SortOrder.ASC ? 1 : -1;
		return 0;
	});

	const start = (params.page - 1) * params.perPage;
	return { rows: sorted.slice(start, start + params.perPage), total: DB.length };
}

const columns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, sortField: 'name' },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true, sortField: 'department' },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		sortField: 'salary',
		right: true,
		format: r => `$${r.salary.toLocaleString()}`,
	},
	{ id: 'status', name: 'Status', selector: r => r.status, sortable: true, sortField: 'status' },
];

export default function ServerSideSortPaginationDemo() {
	const [data, setData] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalRows, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [sortField, setSortField] = useState('name');
	const [sortDir, setSortDir] = useState<SortOrder>(SortOrder.ASC);
	const [resetPage, setResetPage] = useState(false);

	const load = useCallback(async (params: { page: number; perPage: number; sortField: string; sortDir: SortOrder }) => {
		setLoading(true);
		const result = await fakeFetch(params);
		setData(result.rows);
		setTotal(result.total);
		setLoading(false);
	}, []);

	useEffect(() => {
		load({ page, perPage, sortField, sortDir });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	function handlePageChange(p: number) {
		setPage(p);
		load({ page: p, perPage, sortField, sortDir });
	}

	function handlePerPageChange(pp: number, p: number) {
		setPerPage(pp);
		setPage(p);
		load({ page: p, perPage: pp, sortField, sortDir });
	}

	function handleSort(col: TableColumn<Employee>, dir: SortOrder) {
		const field = col.sortField ?? String(col.id);
		setSortField(field);
		setSortDir(dir);
		setPage(1);
		setResetPage(prev => !prev);
		load({ page: 1, perPage, sortField: field, sortDir: dir });
	}

	return (
		<div className="space-y-2">
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{`sort: "${sortField}" ${sortDir} · page: ${page} · perPage: ${perPage} · total: ${totalRows}`}
			</div>
			<DataTable
				columns={columns}
				data={data}
				progressPending={loading}
				pagination
				paginationServer
				paginationTotalRows={totalRows}
				paginationResetDefaultPage={resetPage}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handlePerPageChange}
				sortServer
				onSort={handleSort}
				highlightOnHover
				striped
			/>
		</div>
	);
}
