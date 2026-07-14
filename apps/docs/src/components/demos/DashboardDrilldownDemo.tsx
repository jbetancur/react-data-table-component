import React, { useState } from 'react';
import DataTable, {
	type ConditionalStyles,
	type ExpanderComponentProps,
	type TableColumn,
} from 'react-data-table-component';

interface TeamMember {
	name: string;
	role: string;
	tickets: number;
	utilization: number;
}

interface Department {
	id: number;
	name: string;
	headcount: number;
	budget: number;
	spent: number;
	openTickets: number;
	health: 'good' | 'at-risk' | 'critical';
	members: TeamMember[];
}

const departments: Department[] = [
	{
		id: 1,
		name: 'Engineering',
		headcount: 12,
		budget: 1800000,
		spent: 1240000,
		openTickets: 8,
		health: 'good',
		members: [
			{ name: 'Aria Chen', role: 'Engineering Lead', tickets: 3, utilization: 82 },
			{ name: 'Sam Rivera', role: 'DevOps Engineer', tickets: 2, utilization: 91 },
			{ name: 'Taylor Kim', role: 'Frontend Eng', tickets: 2, utilization: 74 },
			{ name: 'Casey Morgan', role: 'Backend Eng', tickets: 1, utilization: 68 },
		],
	},
	{
		id: 2,
		name: 'Product',
		headcount: 5,
		budget: 750000,
		spent: 680000,
		openTickets: 14,
		health: 'at-risk',
		members: [
			{ name: 'Marcus Webb', role: 'Product Manager', tickets: 7, utilization: 98 },
			{ name: 'Dana Park', role: 'Product Designer', tickets: 7, utilization: 95 },
		],
	},
	{
		id: 3,
		name: 'Design',
		headcount: 4,
		budget: 480000,
		spent: 195000,
		openTickets: 3,
		health: 'good',
		members: [
			{ name: 'Priya Kapoor', role: 'Senior Designer', tickets: 2, utilization: 65 },
			{ name: 'Alex Kim', role: 'UX Researcher', tickets: 1, utilization: 55 },
		],
	},
	{
		id: 4,
		name: 'Analytics',
		headcount: 3,
		budget: 420000,
		spent: 410000,
		openTickets: 21,
		health: 'critical',
		members: [
			{ name: 'Jordan Ellis', role: 'Data Scientist', tickets: 12, utilization: 100 },
			{ name: 'Quinn Adams', role: 'Data Engineer', tickets: 9, utilization: 100 },
		],
	},
	{
		id: 5,
		name: 'Sales',
		headcount: 6,
		budget: 600000,
		spent: 320000,
		openTickets: 5,
		health: 'good',
		members: [
			{ name: 'Taylor Brooks', role: 'Account Manager', tickets: 3, utilization: 72 },
			{ name: 'Riley Stone', role: 'Sales Rep', tickets: 2, utilization: 60 },
		],
	},
];

const HEALTH_CLASS = {
	good: 'bg-green-50 text-green-700 border border-green-200',
	'at-risk': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
	critical: 'bg-red-50 text-red-700 border border-red-200',
};

function UtilBar({ pct }: { pct: number }) {
	const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#22c55e';
	return (
		<div className="flex items-center gap-2">
			<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
				<div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full" />
			</div>
			<span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
		</div>
	);
}

function SpendBar({ budget, spent }: { budget: number; spent: number }) {
	const pct = Math.min(100, Math.round((spent / budget) * 100));
	const color = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#6366f1';
	return (
		<div className="flex items-center gap-2 min-w-[120px]">
			<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
				<div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full" />
			</div>
			<span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
		</div>
	);
}

function initials(name: string) {
	return name
		.split(' ')
		.map(part => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

function DepartmentDetail({ data: dept }: ExpanderComponentProps<Department>) {
	return (
		<div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
			<p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Team members</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{dept.members.map(member => (
					<div
						key={member.name}
						className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5"
					>
						<div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">
							{initials(member.name)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
								<span className="text-[11px] text-gray-400 shrink-0">{member.tickets} open</span>
							</div>
							<p className="text-xs text-gray-500 truncate mb-1">{member.role}</p>
							<UtilBar pct={member.utilization} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

const conditionalRowStyles: ConditionalStyles<Department>[] = [
	{ when: r => r.health === 'critical', style: { backgroundColor: '#fff7f7' } },
	{ when: r => r.health === 'at-risk', style: { backgroundColor: '#fffdf0' } },
];

const columns: TableColumn<Department>[] = [
	{
		id: 'name',
		name: 'Department',
		selector: r => r.name,
		sortable: true,
		grow: 1,
	},
	{
		id: 'headcount',
		name: 'Headcount',
		selector: r => r.headcount,
		sortable: true,
		right: true,
		width: '110px',
	},
	{
		id: 'spend',
		name: 'Budget spend',
		selector: r => r.spent,
		sortable: true,
		width: '200px',
		cell: r => (
			<div className="w-full">
				<div className="text-xs text-gray-500 mb-1">
					${r.spent.toLocaleString()} / ${r.budget.toLocaleString()}
				</div>
				<SpendBar budget={r.budget} spent={r.spent} />
			</div>
		),
	},
	{
		id: 'openTickets',
		name: 'Open tickets',
		selector: r => r.openTickets,
		sortable: true,
		right: true,
		width: '120px',
	},
	{
		id: 'health',
		name: 'Health',
		selector: r => r.health,
		sortable: true,
		width: '110px',
		cell: r => <span className={`text-xs px-2 py-0.5 rounded-full ${HEALTH_CLASS[r.health]}`}>{r.health}</span>,
	},
];

export default function DashboardDrilldownDemo() {
	const [allExpanded, setAllExpanded] = useState(false);

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs text-gray-400">Expand any row to see team member utilization.</p>
				<button
					onClick={() => setAllExpanded(v => !v)}
					className="px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:border-gray-300"
				>
					{allExpanded ? 'Collapse all' : 'Expand all'}
				</button>
			</div>
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					columns={columns}
					data={departments}
					expandableRows
					expandableRowsComponent={DepartmentDetail}
					expandableRowExpanded={() => allExpanded}
					conditionalRowStyles={conditionalRowStyles}
					defaultSortFieldId="name"
					highlightOnHover
				/>
			</div>
		</div>
	);
}
