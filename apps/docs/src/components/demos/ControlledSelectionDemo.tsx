import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	status: 'Active' | 'On Leave';
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', status: 'Active' },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', status: 'Active' },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', status: 'On Leave' },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', status: 'Active' },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', status: 'On Leave' },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Role', selector: r => r.role },
	{ name: 'Status', selector: r => r.status },
];

export default function ControlledSelectionDemo() {
	const [selected, setSelected] = useState<Row[]>([]);
	const [events, setEvents] = useState<string[]>([]);

	const setExternally = (rows: Row[], label: string) => {
		setSelected(rows);
		setEvents(prev => [`external: ${label}`, ...prev].slice(0, 6));
	};

	const selectWhere = (label: string, predicate: (row: Row) => boolean) =>
		setExternally(data.filter(predicate), label);

	const invert = () =>
		setExternally(
			data.filter(row => !selected.some(s => s.id === row.id)),
			'invert selection',
		);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm flex-wrap">
				<button
					onClick={() => selectWhere('status is Active', r => r.status === 'Active')}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Select Active
				</button>
				<button
					onClick={() => selectWhere('role contains "Engineer"', r => r.role.includes('Engineer'))}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Select Engineers
				</button>
				<button
					onClick={invert}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Invert
				</button>
				<button
					onClick={() => setExternally([], 'clear')}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Clear
				</button>
			</div>

			<p className="text-xs text-gray-400">
				The buttons write straight to the <code>selectedRows</code> state. Checking a box in the table
				calls <code>onSelectedRowsChange</code>, which writes back to that same state. Both paths stay in sync.
			</p>

			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectedRows={selected}
				onSelectedRowsChange={({ selectedRows }) => {
					setSelected(selectedRows);
					setEvents(prev => [`table: [${selectedRows.map(r => r.id).join(', ')}]`, ...prev].slice(0, 6));
				}}
				highlightOnHover
			/>

			<div className="grid gap-3 sm:grid-cols-2 text-sm">
				<div>
					<span className="text-gray-500 text-xs font-medium">selectedRows state</span>
					<div className="mt-1 font-mono text-xs text-brand-600 min-h-[1.25rem]">
						{selected.length > 0 ? `[${selected.map(r => r.id).join(', ')}]` : '[]'}
						{selected.length > 0 && (
							<span className="text-gray-400"> — {selected.map(r => r.name).join(', ')}</span>
						)}
					</div>
				</div>
				<div>
					<span className="text-gray-500 text-xs font-medium">recent updates</span>
					<ul className="mt-1 font-mono text-xs text-gray-500 space-y-0.5 min-h-[1.25rem]">
						{events.length === 0 ? (
							<li className="text-gray-400">none yet</li>
						) : (
							events.map((e, i) => <li key={`${e}-${i}`}>{e}</li>)
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
