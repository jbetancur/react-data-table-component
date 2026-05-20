import React, { useRef, useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type DataTableHandle } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	hired: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, hired: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, hired: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, hired: '2021-01-15' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', salary: 162000, hired: '2017-09-05' },
	{ id: 8, name: 'Casey Park', department: 'Design', salary: 109000, hired: '2022-11-19' },
];

const columns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{ id: 'salary', name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}`, right: true, sortable: true },
	{ id: 'hired', name: 'Hired', selector: r => r.hired, sortable: true },
];

export default function SortResetDemo() {
	const ref = useRef<DataTableHandle>(null);
	const [lastSort, setLastSort] = useState<string | null>(null);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3 text-sm">
				<button
					onClick={() => {
						ref.current?.clearSort();
						setLastSort(null);
					}}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Reset sort
				</button>
				<span className="text-xs text-gray-500 font-mono">
					{lastSort ?? 'Sort by any column, then reset'}
				</span>
			</div>
			<DataTable
				ref={ref}
				columns={columns}
				data={data}
				defaultSortFieldId="name"
				defaultSortAsc={true}
				onSort={(col, dir) => setLastSort(`sorted by "${col.id}" ${dir}`)}
				highlightOnHover
			/>
		</div>
	);
}
