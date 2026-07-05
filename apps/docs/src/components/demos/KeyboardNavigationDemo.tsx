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
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, editable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		sortable: true,
		right: true,
		editable: true,
	},
];

export default function KeyboardNavigationDemo() {
	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				Click or Tab into the table, then use only the keyboard: arrows to move, <kbd>Enter</kbd>/<kbd>Space</kbd> to
				sort a header, <kbd>Space</kbd> to select a row, <kbd>Enter</kbd> to expand one, and <kbd>Enter</kbd>/
				<kbd>F2</kbd> to edit Name or Salary.
			</p>
			<DataTable
				columns={columns}
				data={data}
				highlightOnHover
				cellNavigation
				selectableRows
				expandableRows
				expandableRowsComponent={({ data: row }: { data: Employee }) => (
					<div className="px-4 py-2 text-xs text-gray-500">
						Full record for <strong>{row.name}</strong>: {row.department}, ${row.salary.toLocaleString()}
					</div>
				)}
			/>
		</div>
	);
}
