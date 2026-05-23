import React, { useEffect, useState } from 'react';
import DataTable, { type FilterState, SortOrder, type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const ALL_DATA: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000 },
	{ id: 7, name: 'Casey Morgan', department: 'Engineering', salary: 138000 },
	{ id: 8, name: 'Alex Kim', department: 'Design', salary: 112000 },
	{ id: 9, name: 'Dana Park', department: 'Product', salary: 125000 },
	{ id: 10, name: 'Riley Stone', department: 'Sales', salary: 104000 },
	{ id: 11, name: 'Quinn Adams', department: 'Analytics', salary: 137000 },
	{ id: 12, name: 'Morgan Lee', department: 'Engineering', salary: 149000 },
];

function simulateFetch({
	page, perPage, sortId, sortDir, filters,
}: {
	page: number;
	perPage: number;
	sortId: string;
	sortDir: SortOrder;
	filters: Record<string, FilterState>;
}): Promise<{ rows: Employee[]; total: number }> {
	return new Promise(resolve => {
		setTimeout(() => {
			let rows = [...ALL_DATA];

			// filter
			const nameFilter = filters['name'];
			if (nameFilter?.value) {
				rows = rows.filter(r => r.name.toLowerCase().includes(String(nameFilter.value).toLowerCase()));
			}
			const deptFilter = filters['department'];
			if (deptFilter?.value) {
				rows = rows.filter(r => r.department.toLowerCase().includes(String(deptFilter.value).toLowerCase()));
			}

			// sort
			if (sortId) {
				rows.sort((a, b) => {
					const av = a[sortId as keyof Employee];
					const bv = b[sortId as keyof Employee];
					return sortDir === SortOrder.ASC
						? av < bv ? -1 : av > bv ? 1 : 0
						: av > bv ? -1 : av < bv ? 1 : 0;
				});
			}

			const total = rows.length;
			rows = rows.slice((page - 1) * perPage, page * perPage);
			resolve({ rows, total });
		}, 400);
	});
}

export default function ServerSideRecipeDemo() {
	const [rows, setRows] = useState<Employee[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);
	const [sortId, setSortId] = useState('');
	const [sortDir, setSortDir] = useState<SortOrder>(SortOrder.ASC);
	const [filters, setFilters] = useState<Record<string, FilterState>>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		simulateFetch({ page, perPage, sortId, sortDir, filters }).then(res => {
			if (cancelled) return;
			setRows(res.rows);
			setTotal(res.total);
			setLoading(false);
		});
		return () => { cancelled = true; };
	}, [page, perPage, sortId, sortDir, filters]);

	const columns: TableColumn<Employee>[] = [
		{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, filterable: true },
		{ id: 'department', name: 'Department', selector: r => r.department, sortable: true, filterable: true },
		{
			id: 'salary', name: 'Salary', selector: r => r.salary, sortable: true,
			right: true, format: r => `$${r.salary.toLocaleString()}`,
		},
	];

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden">
			<DataTable
				columns={columns}
				data={rows}
				progressPending={loading}
				pagination
				paginationServer
				paginationTotalRows={total}
				paginationPerPage={perPage}
				onChangePage={p => setPage(p)}
				onChangeRowsPerPage={(pp, p) => { setPerPage(pp); setPage(p); }}
				sortServer
				onSort={(col, dir) => { setSortId(col.id as string); setSortDir(dir); setPage(1); }}
				filterValues={filters}
				onFilterChange={(columnId, next) =>
					setFilters(prev => ({ ...prev, [columnId]: next }))
				}
				highlightOnHover
			/>
		</div>
	);
}
