import React, { useState } from 'react';
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

const initialColumns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, reorder: true },
	{ id: 'role', name: 'Role', selector: r => r.role, reorder: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true, reorder: true },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		reorder: true,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
	},
];

export default function DraggableColumnsDemo() {
	const [columns, setColumns] = useState(initialColumns);
	const [order, setOrder] = useState(initialColumns.map(c => c.id as string));

	function handleOrderChange(next: TableColumn<Row>[]) {
		setColumns(next);
		setOrder(next.map(c => c.id as string));
	}

	return (
		<div className="space-y-3">
			<p className="text-xs text-gray-400">Drag any column header to reorder it.</p>
			<DataTable columns={columns} data={data} onColumnOrderChange={handleOrderChange} highlightOnHover />
			<p className="text-xs text-gray-400">
				Current order: <span className="font-mono text-gray-600">{order.join(' → ')}</span>
			</p>
		</div>
	);
}
