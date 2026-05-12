import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: 'Active' | 'On Leave' | 'Terminated';
	joined: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 142000, status: 'Active', joined: '2021-03-15' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 128000, status: 'Active', joined: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 115000, status: 'On Leave', joined: '2022-01-10' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 134000, status: 'Active', joined: '2019-11-20' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 98000, status: 'Terminated', joined: '2018-05-03' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 89000, status: 'Active', joined: '2023-02-14' },
];

const statusColors: Record<Employee['status'], string> = {
	Active: 'background:#dcfce7;color:#15803d',
	'On Leave': 'background:#fef9c3;color:#854d0e',
	Terminated: 'background:#fee2e2;color:#991b1b',
};

const columns: TableColumn<Employee>[] = [
	{
		name: 'Employee',
		cell: row => (
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: '50%',
						background: '#dbeafe',
						color: '#1d4ed8',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 700,
						fontSize: 13,
						flexShrink: 0,
					}}
				>
					{row.name
						.split(' ')
						.map(n => n[0])
						.join('')}
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 14 }}>{row.name}</div>
					<div style={{ fontSize: 12, color: '#6b7280' }}>{row.department}</div>
				</div>
			</div>
		),
		minWidth: '200px',
		grow: 2,
	},
	{
		name: 'Salary',
		selector: row => row.salary,
		format: row =>
			new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
				row.salary,
			),
		sortable: true,
		right: true,
	},
	{
		name: 'Joined',
		selector: row => row.joined,
		format: row =>
			new Date(row.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
		sortable: true,
		right: true,
	},
	{
		name: 'Status',
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
		center: true,
		width: '130px',
	},
	{
		name: '',
		cell: row => (
			<button
				onClick={() => alert(`Viewing profile for ${row.name}`)}
				style={{
					fontSize: 12,
					padding: '4px 12px',
					borderRadius: 6,
					border: '1px solid #e5e7eb',
					background: 'white',
					cursor: 'pointer',
					whiteSpace: 'nowrap',
				}}
			>
				View profile
			</button>
		),
		button: true,
		width: '120px',
	},
];

export default function CellsDemo() {
	return <DataTable columns={columns} data={data} highlightOnHover defaultSortFieldId={2} defaultSortAsc={false} />;
}
