import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
];

const columns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		sortable: true,
		right: true,
	},
];

export default function KeyboardSortDemo() {
	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				<kbd>↑</kbd> from the first body row moves into the header. <kbd>Enter</kbd> or <kbd>Space</kbd> on a
				sortable header cycles ascending → descending → unsorted, same as a click. <kbd>↓</kbd> from the header
				returns to the body in the same column.
			</p>
			<DataTable columns={columns} data={data} highlightOnHover cellNavigation />
		</div>
	);
}
