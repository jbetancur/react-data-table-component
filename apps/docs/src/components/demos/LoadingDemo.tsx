import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

const ROWS: Row[] = [
	{ id: 1, name: 'Aria Chen',    department: 'Engineering', salary: 155000, status: 'Active' },
	{ id: 2, name: 'Marcus Webb',  department: 'Product',     salary: 132000, status: 'Remote' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design',      salary: 118000, status: 'Active' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics',   salary: 143000, status: 'On Leave' },
	{ id: 5, name: 'Sam Rivera',   department: 'Engineering', salary: 128000, status: 'Contractor' },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name',       selector: r => r.name,       sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{ name: 'Salary',     selector: r => r.salary,     right: true, format: r => `$${r.salary.toLocaleString()}` },
	{ name: 'Status',     selector: r => r.status },
];

function delay(ms: number) {
	return new Promise(r => setTimeout(r, ms));
}

type Mode = 'initial' | 'refetch' | 'idle';

export default function LoadingDemo() {
	const [mode, setMode] = useState<Mode>('idle');
	const [data, setData] = useState<Row[]>(ROWS);
	const [pending, setPending] = useState(false);

	async function simulateInitial() {
		setData([]);
		setPending(true);
		setMode('initial');
		await delay(1800);
		setData(ROWS);
		setPending(false);
		setMode('idle');
	}

	async function simulateRefetch() {
		setPending(true);
		setMode('refetch');
		await delay(1800);
		setPending(false);
		setMode('idle');
	}

	const btnBase = 'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
	const btnPrimary = `${btnBase} bg-brand-600 text-white border-brand-600 hover:bg-brand-700`;
	const btnSecondary = `${btnBase} bg-white text-gray-600 border-gray-200 hover:border-gray-400`;

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<button className={btnPrimary} disabled={pending} onClick={simulateInitial}>
					Simulate initial load
				</button>
				<button className={btnSecondary} disabled={pending} onClick={simulateRefetch}>
					Simulate re-fetch
				</button>
				{mode !== 'idle' && (
					<span className="text-xs text-gray-400 italic">
						{mode === 'initial' ? 'Loading with no existing data — skeleton rows shown' : 'Re-fetching — existing rows dimmed, spinner overlaid'}
					</span>
				)}
			</div>
			<DataTable
				columns={columns}
				data={data}
				progressPending={pending}
				highlightOnHover
				striped
			/>
		</div>
	);
}
