import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

type Status = 'Active' | 'On Leave' | 'Terminated';
type Department = 'Engineering' | 'Product' | 'Design' | 'Analytics';

interface Employee {
	id: number;
	name: string;
	department: Department;
	status: Status;
	salary: number;
	remote: boolean;
}

const initialData: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', status: 'Active', salary: 155000, remote: true },
	{ id: 2, name: 'Marcus Webb', department: 'Product', status: 'Active', salary: 132000, remote: false },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', status: 'On Leave', salary: 118000, remote: true },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', status: 'Active', salary: 143000, remote: false },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', status: 'Terminated', salary: 128000, remote: false },
];

const statusColors: Record<Status, string> = {
	Active: 'background:#dcfce7;color:#15803d',
	'On Leave': 'background:#fef9c3;color:#854d0e',
	Terminated: 'background:#fee2e2;color:#991b1b',
};

export default function InlineEditingDemo() {
	const [data, setData] = React.useState<Employee[]>(initialData);
	const [lastEdit, setLastEdit] = React.useState<string | null>(null);

	const handleCellEdit = (row: Employee, value: string, column: TableColumn<Employee>) => {
		const field = column.id as keyof Employee;
		const parsed = field === 'salary' ? Number(value) || row.salary : field === 'remote' ? value === 'true' : value;
		setData(prev => prev.map(r => (r.id === row.id ? { ...r, [field]: parsed } : r)));
		setLastEdit(`Updated ${row.name} → ${String(column.name)}: "${value}"`);
	};

	const columns: TableColumn<Employee>[] = [
		{
			id: 'name',
			name: 'Name',
			selector: r => r.name,
			sortable: true,
			editable: true,
			onCellEdit: handleCellEdit,
		},
		{
			id: 'department',
			name: 'Department',
			selector: r => r.department,
			sortable: true,
			editor: {
				type: 'select',
				options: [
					{ value: 'Engineering', label: 'Engineering' },
					{ value: 'Product', label: 'Product' },
					{ value: 'Design', label: 'Design' },
					{ value: 'Analytics', label: 'Analytics' },
				],
			},
			onCellEdit: handleCellEdit,
		},
		{
			id: 'status',
			name: 'Status',
			selector: r => r.status,
			cell: row => (
				<span
					style={{
						...Object.fromEntries(statusColors[row.status].split(';').map(p => p.split(':') as [string, string])),
						padding: '2px 10px',
						borderRadius: 999,
						fontSize: 12,
						fontWeight: 600,
					}}
				>
					{row.status}
				</span>
			),
			editor: {
				type: 'select',
				options: [
					{ value: 'Active', label: 'Active' },
					{ value: 'On Leave', label: 'On Leave' },
					{ value: 'Terminated', label: 'Terminated' },
				],
			},
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
		{
			id: 'remote',
			name: 'Remote',
			selector: r => r.remote,
			format: r => (r.remote ? 'Yes' : 'No'),
			center: true,
			editor: { type: 'checkbox' },
			onCellEdit: handleCellEdit,
		},
	];

	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				Click any cell to edit. <strong>Name</strong> and <strong>Salary</strong> are text inputs;{' '}
				<strong>Department</strong> and <strong>Status</strong> are dropdowns; <strong>Remote</strong> is a checkbox.{' '}
				<kbd>Enter</kbd> commits, <kbd>Esc</kbd> cancels. Keyboard navigation is enabled too: click or Tab into the
				table, move between cells and headers with the arrow keys, and press <kbd>Enter</kbd> to edit or sort.
			</p>
			<DataTable columns={columns} data={data} highlightOnHover cellNavigation />
			{lastEdit && <div className="text-xs text-emerald-600 font-mono">{lastEdit}</div>}
		</div>
	);
}
