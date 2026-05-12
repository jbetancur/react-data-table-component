import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
	email: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen',     department: 'Engineering', role: 'Engineering Lead',  email: 'aria@example.com' },
	{ id: 2, name: 'Marcus Webb',   department: 'Product',     role: 'Product Manager',   email: 'marcus@example.com' },
	{ id: 3, name: 'Priya Kapoor',  department: 'Design',      role: 'Senior Designer',   email: 'priya@example.com' },
	{ id: 4, name: 'Jordan Ellis',  department: 'Analytics',   role: 'Data Scientist',    email: 'jordan@example.com' },
	{ id: 5, name: 'Sam Rivera',    department: 'Engineering', role: 'DevOps Engineer',   email: 'sam@example.com' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales',       role: 'Account Manager',   email: 'taylor@example.com' },
];

export function RowClickDemo() {
	const [selected, setSelected] = useState<Employee | null>(null);

	const columns: TableColumn<Employee>[] = [
		{ name: 'Name',       selector: r => r.name,       sortable: true },
		{ name: 'Department', selector: r => r.department, sortable: true },
		{ name: 'Role',       selector: r => r.role },
	];

	return (
		<div>
			<DataTable
				columns={columns}
				data={data}
				pointerOnHover
				highlightOnHover
				onRowClicked={row => setSelected(row)}
			/>
			{selected && (
				<div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6, background: '#f0f9ff', border: '1px solid #bae6fd', fontSize: 13 }}>
					<strong>{selected.name}</strong> — {selected.role}, {selected.department}
					<span style={{ marginLeft: 12, color: '#0369a1' }}>{selected.email}</span>
				</div>
			)}
		</div>
	);
}

export function RowLinkDemo() {
	const [log, setLog] = useState<string[]>([]);

	const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 4));

	const columns: TableColumn<Employee>[] = [
		{ name: 'Name',       selector: r => r.name,       sortable: true },
		{ name: 'Department', selector: r => r.department },
		{ name: 'Role',       selector: r => r.role },
		{
			name: 'Email',
			ignoreRowClick: true,
			cell: row => (
				<a href={`mailto:${row.email}`} style={{ color: '#0369a1' }} onClick={e => e.stopPropagation()}>
					{row.email}
				</a>
			),
		},
	];

	return (
		<div>
			<DataTable
				columns={columns}
				data={data}
				pointerOnHover
				highlightOnHover
				onRowClicked={(row, e) => {
					if (e.ctrlKey || e.metaKey) {
						addLog(`⌘ ${row.name} → opened in new tab`);
					} else {
						addLog(`→ navigated to /employees/${row.id}`);
					}
				}}
			/>
			{log.length > 0 && (
				<div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
					{log.map((l, i) => <div key={i}>{l}</div>)}
				</div>
			)}
			<p style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
				Click a row to navigate. Ctrl/⌘+click to open in new tab. Email cells are independent links.
			</p>
		</div>
	);
}

export function ActionCellDemo() {
	const [log, setLog] = useState<string[]>([]);

	const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 4));

	const columns: TableColumn<Employee>[] = [
		{ name: 'Name',       selector: r => r.name,       sortable: true },
		{ name: 'Department', selector: r => r.department, sortable: true },
		{ name: 'Role',       selector: r => r.role },
		{
			name: 'Actions',
			button: true,
			cell: row => (
				<div style={{ display: 'flex', gap: 6 }}>
					<button
						style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white' }}
						onClick={() => addLog(`Edited ${row.name}`)}
					>
						Edit
					</button>
					<button
						style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: '1px solid #fca5a5', cursor: 'pointer', background: '#fff1f2', color: '#dc2626' }}
						onClick={() => addLog(`Deleted ${row.name}`)}
					>
						Delete
					</button>
				</div>
			),
		},
	];

	return (
		<div>
			<DataTable
				columns={columns}
				data={data}
				pointerOnHover
				highlightOnHover
				onRowClicked={row => addLog(`Row clicked: ${row.name}`)}
			/>
			{log.length > 0 && (
				<div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
					{log.map((l, i) => <div key={i}>{l}</div>)}
				</div>
			)}
			<p style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
				Action buttons fire independently. Clicking the row itself fires <code>onRowClicked</code>.
			</p>
		</div>
	);
}
