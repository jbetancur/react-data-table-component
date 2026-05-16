import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	department: string;
	salary: number;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', department: 'Engineering', salary: 128000 },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true, width: '180px', minWidth: '100px' },
	{ name: 'Role', selector: r => r.role, sortable: true, minWidth: '120px' },
	{ name: 'Department', selector: r => r.department, sortable: true, width: '140px', minWidth: '80px' },
	{
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		width: '110px',
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
	},
];

export default function ResizableDemo() {
	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">Drag the right edge of any column header to resize it.</p>
			<DataTable columns={columns} data={data} resizable highlightOnHover />
		</div>
	);
}
