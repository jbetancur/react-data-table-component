import { useState, useEffect, useCallback, useRef } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, SortOrder } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

// 200-row dataset simulating a server DB
const DB: Employee[] = Array.from({ length: 200 }, (_, i) => ({
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

/** Simulate a server: filter, sort, and paginate the dataset with a delay. */
async function fakeServerFetch(params: {
	page: number;
	perPage: number;
	sortField: string;
	sortDir: SortOrder;
	search: string;
}): Promise<{ rows: Employee[]; total: number }> {
	await new Promise(r => setTimeout(r, 350)); // simulate network latency

	let rows = [...DB];

	// Filter
	if (params.search) {
		const q = params.search.toLowerCase();
		rows = rows.filter(
			r =>
				r.name.toLowerCase().includes(q) ||
				r.department.toLowerCase().includes(q) ||
				r.status.toLowerCase().includes(q),
		);
	}

	// Sort
	rows.sort((a, b) => {
		const av = a[params.sortField as keyof Employee] as string | number;
		const bv = b[params.sortField as keyof Employee] as string | number;
		if (av < bv) return params.sortDir === 'asc' ? -1 : 1;
		if (av > bv) return params.sortDir === 'asc' ? 1 : -1;
		return 0;
	});

	const total = rows.length;
	const start = (params.page - 1) * params.perPage;
	return { rows: rows.slice(start, start + params.perPage), total };
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

export default function ServerSideDemo() {
	const [data, setData] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalRows, setTotal] = useState(0);
	const [perPage, setPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [sortField, setSortField] = useState('name');
	const [sortDir, setSortDir] = useState<SortOrder>(SortOrder.ASC);
	const [search, setSearch] = useState('');
	const [resetPage, setResetPage] = useState(false);
	const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchData = useCallback(
		async (params: { page: number; perPage: number; sortField: string; sortDir: SortOrder; search: string }) => {
			setLoading(true);
			const result = await fakeServerFetch(params);
			setData(result.rows);
			setTotal(result.total);
			setLoading(false);
		},
		[],
	);

	useEffect(() => {
		fetchData({ page, perPage, sortField, sortDir, search });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	function handlePageChange(p: number) {
		setPage(p);
		fetchData({ page: p, perPage, sortField, sortDir, search });
	}

	function handlePerPageChange(pp: number, p: number) {
		setPerPage(pp);
		fetchData({ page: p, perPage: pp, sortField, sortDir, search });
	}

	function handleSort(col: TableColumn<Employee>, dir: SortOrder) {
		const field = col.sortField ?? 'name';
		setSortField(field);
		setSortDir(dir);
		fetchData({ page, perPage, sortField: field, sortDir: dir, search });
	}

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		const q = e.target.value;
		setSearch(q);
		if (searchDebounce.current) clearTimeout(searchDebounce.current);
		searchDebounce.current = setTimeout(() => {
			setResetPage(prev => !prev);
			fetchData({ page: 1, perPage, sortField, sortDir, search: q });
		}, 400);
	}

	return (
		<div>
			<input
				type="search"
				placeholder="Search name, department, status…"
				value={search}
				onChange={handleSearch}
				style={{
					marginBottom: 12,
					padding: '6px 10px',
					border: '1px solid #e5e7eb',
					borderRadius: 6,
					fontSize: 13,
					width: 260,
				}}
			/>
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
			/>
		</div>
	);
}
