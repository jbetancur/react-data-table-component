import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const initialData: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
];

export default function KeyboardEditDemo() {
	const [data, setData] = React.useState<Employee[]>(initialData);

	const handleCellEdit = (row: Employee, value: string, column: TableColumn<Employee>) => {
		const field = column.id as keyof Employee;
		setData(prev =>
			prev.map(r => (r.id === row.id ? { ...r, [field]: field === 'salary' ? Number(value) || r.salary : value } : r)),
		);
	};

	const columns: TableColumn<Employee>[] = [
		{ id: 'name', name: 'Name', selector: r => r.name, editable: true, onCellEdit: handleCellEdit },
		{ id: 'department', name: 'Department', selector: r => r.department },
		{
			id: 'salary',
			name: 'Salary',
			selector: r => r.salary,
			format: r => `$${r.salary.toLocaleString()}`,
			right: true,
			editable: true,
			onCellEdit: handleCellEdit,
		},
	];

	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				Arrow to Name or Salary, then press <kbd>Enter</kbd> or <kbd>F2</kbd> to open the editor. <kbd>Enter</kbd>{' '}
				commits and <kbd>Escape</kbd> cancels — either way, focus returns to the cell so arrow-key navigation
				continues immediately. Department has no editor, so Enter/F2 do nothing there.
			</p>
			<DataTable columns={columns} data={data} highlightOnHover cellNavigation />
		</div>
	);
}
