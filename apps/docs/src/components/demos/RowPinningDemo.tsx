import React, { useState, useMemo } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, SortOrder } from 'react-data-table-component';

type Status = 'Active' | 'On Leave' | 'Terminated';

interface Employee {
	id: number;
	name: string;
	department: string;
	status: Status;
	salary: number;
}

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

export default function RowPinningDemo() {
	const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set([1, 4]));

	const togglePin = (id: number) =>
		setPinnedIds(prev => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});

	const columns = useMemo(
		(): TableColumn<Employee>[] => [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				sortable: true,
				cell: r => (
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<button
							title={pinnedIds.has(r.id) ? 'Unpin row' : 'Pin row to top'}
							onClick={e => {
								e.stopPropagation();
								togglePin(r.id);
							}}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								padding: 0,
								lineHeight: 1,
								opacity: pinnedIds.has(r.id) ? 1 : 0.25,
								color: pinnedIds.has(r.id) ? '#7c3aed' : 'inherit',
								fontSize: 14,
							}}
						>
							📌
						</button>
						{r.name}
						{pinnedIds.has(r.id) && (
							<span
								style={{
									fontSize: 10,
									background: '#ede9fe',
									color: '#6d28d9',
									padding: '1px 6px',
									borderRadius: 999,
									fontWeight: 600,
								}}
							>
								pinned
							</span>
						)}
					</div>
				),
			},
			{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
			{
				id: 'status',
				name: 'Status',
				selector: r => r.status,
				cell: r => <span style={STATUS_STYLE[r.status]}>{r.status}</span>,
				sortable: true,
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
		[pinnedIds],
	);

	const sortFunction = useMemo(
		() => (rows: Employee[], selector: (r: Employee) => string | number | boolean, direction: SortOrder) => {
			const pinned = rows.filter(r => pinnedIds.has(r.id));
			const rest = rows.filter(r => !pinnedIds.has(r.id));
			const sorted = [...rest].sort((a, b) => {
				const av = selector(a);
				const bv = selector(b);
				if (av === bv) return 0;
				const cmp = av > bv ? 1 : -1;
				return direction === SortOrder.ASC ? cmp : -cmp;
			});
			return [...pinned, ...sorted];
		},
		[pinnedIds],
	);

	return (
		<div className="space-y-3">
			<p className="text-xs text-gray-500">
				Click the 📌 icon on any row to pin it. Pinned rows stay at the top regardless of how you sort. Sort any column
				to see the behaviour.
			</p>
			<DataTable
				columns={columns}
				data={rawData}
				defaultSortFieldId="name"
				sortFunction={sortFunction}
				highlightOnHover
			/>
		</div>
	);
}
