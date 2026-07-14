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
	{ id: 'name', name: 'Name', selector: r => r.name },
	{ id: 'department', name: 'Department', selector: r => r.department },
	{ id: 'salary', name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}`, right: true },
];

export default function KeyboardArrowNavDemo() {
	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				A plain read-only table. Click a cell, then use <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> to move,{' '}
				<kbd>Home</kbd>/<kbd>End</kbd> to jump to the row edges, and <kbd>Ctrl</kbd>+<kbd>Home</kbd>/<kbd>Ctrl</kbd>+
				<kbd>End</kbd> to jump to the grid corners. No editing, sorting, selection, or expansion here — just movement,
				which works on any table.
			</p>
			<DataTable columns={columns} data={data} highlightOnHover cellNavigation />
		</div>
	);
}
