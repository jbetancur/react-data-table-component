import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type SortColumn, SortOrder } from 'react-data-table-component';

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
	{ id: 4, name: 'Jordan Ellis', department: 'Engineering', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', salary: 162000, hired: '2017-09-05' },
	{ id: 8, name: 'Casey Park', department: 'Design', salary: 109000, hired: '2022-11-19' },
];

const columns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
		sortable: true,
	},
	{ id: 'hired', name: 'Hired', selector: r => r.hired, sortable: true },
];

export default function MultiSortDemo() {
	const [sortColumns, setSortColumns] = useState<SortColumn<Employee>[]>([]);

	const summary =
		sortColumns.length === 0
			? 'No sort — click a header to sort, click a third time to remove it'
			: sortColumns.map((s, i) => `${i + 1}. ${String(s.column.id)} ${s.sortDirection}`).join('  ·  ');

	return (
		<div className="space-y-3">
			<p className="text-xs text-gray-500">
				Ctrl-click (⌘-click on macOS) a second column header to add it to the sort. Cycle each column ascending →
				descending → off.
			</p>
			<DataTable
				columns={columns}
				data={data}
				sortMulti
				defaultSortFieldId="department"
				onSort={(_col, _dir, _rows, next) => setSortColumns(next as SortColumn<Employee>[])}
				highlightOnHover
			/>
			<span className="block text-xs text-gray-500 font-mono">{summary}</span>
		</div>
	);
}
