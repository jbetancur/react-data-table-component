import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	role: string;
	department: string;
	salary: number;
}

const initialData: Employee[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', department: 'Engineering', salary: 128000 },
];

export default function InlineEditingDemo() {
	const [data, setData] = React.useState<Employee[]>(initialData);
	const [lastEdit, setLastEdit] = React.useState<string | null>(null);

	const handleCellEdit = (row: Employee, value: string, column: TableColumn<Employee>) => {
		const field = column.id as keyof Employee;
		setData(prev =>
			prev.map(r => (r.id === row.id ? { ...r, [field]: field === 'salary' ? Number(value) || r.salary : value } : r)),
		);
		setLastEdit(`Updated ${row.name} → ${String(column.name)}: "${value}"`);
	};

	const columns: TableColumn<Employee>[] = [
		{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, editable: true, onCellEdit: handleCellEdit },
		{ id: 'role', name: 'Role', selector: r => r.role, sortable: true, editable: true, onCellEdit: handleCellEdit },
		{
			id: 'department',
			name: 'Department',
			selector: r => r.department,
			sortable: true,
			editable: true,
			onCellEdit: handleCellEdit,
		},
		{
			id: 'salary',
			name: 'Salary',
			selector: r => r.salary,
			format: r => `$${r.salary.toLocaleString()}`,
			sortable: true,
			right: true,
			editable: true,
			onCellEdit: handleCellEdit,
		},
	];

	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				Click any cell to edit. Press <kbd>Enter</kbd> to commit, <kbd>Esc</kbd> to cancel.
			</p>
			<DataTable columns={columns} data={data} highlightOnHover />
			{lastEdit && <div className="text-xs text-emerald-600 font-mono">{lastEdit}</div>}
		</div>
	);
}
