import { useState, useCallback } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, SortOrder } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	hired: string;
}

const SOURCE: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, hired: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, hired: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, hired: '2021-01-15' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', salary: 162000, hired: '2017-09-05' },
	{ id: 8, name: 'Casey Park', department: 'Design', salary: 109000, hired: '2022-11-19' },
	{ id: 9, name: 'Drew Okafor', department: 'HR', salary: 88000, hired: '2023-08-14' },
	{ id: 10, name: 'Riley Zhang', department: 'Analytics', salary: 136000, hired: '2020-12-03' },
];

async function fakeSort(field: string, dir: SortOrder): Promise<Employee[]> {
	await new Promise(r => setTimeout(r, 250));
	return [...SOURCE].sort((a, b) => {
		const av = a[field as keyof Employee] as string | number;
		const bv = b[field as keyof Employee] as string | number;
		if (av < bv) return dir === SortOrder.ASC ? -1 : 1;
		if (av > bv) return dir === SortOrder.ASC ? 1 : -1;
		return 0;
	});
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
	{ id: 'hired', name: 'Hired', selector: r => r.hired, sortable: true, sortField: 'hired' },
];

export default function ServerSideSortingDemo() {
	const [data, setData] = useState<Employee[]>(SOURCE);
	const [loading, setLoading] = useState(false);
	const [lastSort, setLastSort] = useState<{ field: string; dir: string } | null>(null);

	const handleSort = useCallback(async (col: TableColumn<Employee>, dir: SortOrder) => {
		const field = col.sortField ?? String(col.id);
		setLoading(true);
		setLastSort({ field, dir });
		const sorted = await fakeSort(field, dir);
		setData(sorted);
		setLoading(false);
	}, []);

	return (
		<div className="space-y-3">
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{lastSort
					? `onSort → field: "${lastSort.field}", direction: "${lastSort.dir}" (fetched from server)`
					: 'onSort → (click a sortable column header)'}
			</div>
			<DataTable
				columns={columns}
				data={data}
				progressPending={loading}
				sortServer
				onSort={handleSort}
				highlightOnHover
			/>
		</div>
	);
}
