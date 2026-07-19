import React, { useState, useMemo } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type Selector, SortOrder } from 'react-data-table-component';

type Status = 'Active' | 'On Leave' | 'Terminated';

interface Employee {
	id: number;
	name: string;
	department: string;
	status: Status;
	salary: number;
}

const STATUS_ORDER: Record<Status, number> = { Active: 0, 'On Leave': 1, Terminated: 2 };

const STATUS_STYLE: Record<Status, React.CSSProperties> = {
	Active: {
		background: '#dcfce7',
		color: '#15803d',
		padding: '2px 10px',
		borderRadius: 999,
		fontSize: 12,
		fontWeight: 600,
	},
	'On Leave': {
		background: '#fef9c3',
		color: '#854d0e',
		padding: '2px 10px',
		borderRadius: 999,
		fontSize: 12,
		fontWeight: 600,
	},
	Terminated: {
		background: '#fee2e2',
		color: '#991b1b',
		padding: '2px 10px',
		borderRadius: 999,
		fontSize: 12,
		fontWeight: 600,
	},
};

const rawData: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', status: 'Active', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', status: 'Terminated', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', status: 'On Leave', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', status: 'Active', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', status: 'Terminated', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', status: 'Active', salary: 97000 },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', status: 'On Leave', salary: 162000 },
	{ id: 8, name: 'Casey Park', department: 'Design', status: 'Active', salary: 109000 },
	{ id: 9, name: 'Jamie Okonkwo', department: 'Sales', status: 'Terminated', salary: 88000 },
	{ id: 10, name: 'Alex Torres', department: 'Analytics', status: 'Active', salary: 151000 },
];

type Mode = 'status-priority' | 'secondary-sort';

export default function PrioritySortDemo() {
	const [mode, setMode] = useState<Mode>('status-priority');

	const columns = useMemo(
		(): TableColumn<Employee>[] => [
			{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
			{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
			{
				id: 'status',
				name: 'Status',
				selector: r => STATUS_ORDER[r.status],
				cell: r => <span style={STATUS_STYLE[r.status]}>{r.status}</span>,
				sortable: mode === 'status-priority',
				...(mode === 'status-priority' && {
					sortFunction: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
				}),
			},
			{
				id: 'salary',
				name: 'Salary',
				selector: r => r.salary,
				format: r => `$${r.salary.toLocaleString()}`,
				right: true,
				sortable: true,
			},
		],
		[mode],
	);

	const sortFunction = useMemo(() => {
		if (mode === 'secondary-sort') {
			return (rows: Employee[], selector: Selector<Employee>, direction: SortOrder) =>
				[...rows].sort((a, b) => {
					const av = selector(a);
					const bv = selector(b);
					const primary = av === bv ? 0 : (av > bv ? 1 : -1) * (direction === SortOrder.ASC ? 1 : -1);
					return primary !== 0 ? primary : b.salary - a.salary;
				});
		}
		return undefined;
	}, [mode]);

	const MODES: { id: Mode; label: string; description: string }[] = [
		{
			id: 'status-priority',
			label: 'Status order',
			description: 'Sort Status by a custom priority: Active → On Leave → Terminated. Click the Status header.',
		},
		{
			id: 'secondary-sort',
			label: 'Secondary sort',
			description: 'Within equal primary values, break ties by Salary (desc). Try sorting by Department.',
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2 text-sm">
				{MODES.map(m => (
					<button
						key={m.id}
						type="button"
						onClick={() => setMode(m.id)}
						className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
							mode === m.id
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{m.label}
					</button>
				))}
			</div>

			<p className="text-xs text-gray-500">{MODES.find(m => m.id === mode)?.description}</p>

			<DataTable
				key={mode}
				columns={columns}
				data={rawData}
				defaultSortFieldId={mode === 'status-priority' ? 'status' : 'name'}
				defaultSortAsc
				sortFunction={sortFunction}
				highlightOnHover
			/>
		</div>
	);
}
