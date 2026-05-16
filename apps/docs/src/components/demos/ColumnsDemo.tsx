import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type ConditionalStyles } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: 'Active' | 'Remote' | 'Contractor' | 'On Leave';
	startDate: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, status: 'Active', startDate: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, status: 'Remote', startDate: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, status: 'Active', startDate: '2021-01-15' },
	{
		id: 4,
		name: 'Jordan Ellis',
		department: 'Analytics',
		salary: 143000,
		status: 'Contractor',
		startDate: '2018-11-30',
	},
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, status: 'On Leave', startDate: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, status: 'Remote', startDate: '2023-02-08' },
	{ id: 7, name: 'Casey Morgan', department: 'HR', salary: 88000, status: 'Active', startDate: '2023-09-14' },
	{ id: 8, name: 'Alex Kim', department: 'Engineering', salary: 162000, status: 'Active', startDate: '2017-06-05' },
];

const statusColors: Record<Employee['status'], { bg: string; color: string }> = {
	Active: { bg: '#dcfce7', color: '#15803d' },
	Remote: { bg: '#dbeafe', color: '#1d4ed8' },
	Contractor: { bg: '#fef9c3', color: '#a16207' },
	'On Leave': { bg: '#f3f4f6', color: '#6b7280' },
};

const StatusBadge = ({ status }: { status: Employee['status'] }) => {
	const { bg, color } = statusColors[status];
	return (
		<span
			style={{
				padding: '2px 8px',
				borderRadius: 12,
				fontSize: 11,
				fontWeight: 600,
				background: bg,
				color,
			}}
		>
			{status}
		</span>
	);
};

const conditionalCellStyles: ConditionalStyles<Employee>[] = [
	{ when: r => r.salary > 150000, style: { fontWeight: 700 } },
];

export default function ColumnsDemo() {
	const [showDept, setShowDept] = useState(true);
	const [showSalary, setShowSalary] = useState(true);
	const [filterable, setFilterable] = useState(false);

	const columns: TableColumn<Employee>[] = [
		{
			id: 'name',
			name: 'Name',
			selector: r => r.name,
			sortable: true,
			filterable,
			grow: 1.5,
		},
		{
			id: 'department',
			name: 'Department',
			selector: r => r.department,
			sortable: true,
			omit: !showDept,
		},
		{
			id: 'salary',
			name: 'Salary',
			selector: r => r.salary,
			sortable: true,
			right: true,
			format: r => `$${r.salary.toLocaleString()}`,
			conditionalCellStyles,
			omit: !showSalary,
		},
		{
			id: 'status',
			name: 'Status',
			selector: r => r.status,
			sortable: true,
			center: true,
			cell: r => <StatusBadge status={r.status} />,
		},
		{
			id: 'start',
			name: 'Start date',
			selector: r => r.startDate,
			sortable: true,
			format: r =>
				new Date(r.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
		},
	];

	const btnBase = 'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer';
	const btnOn = 'bg-brand-600 text-white border-brand-600';
	const btnOff = 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2 text-sm">
				<span className="text-gray-500 text-xs">Columns:</span>
				<button className={`${btnBase} ${showDept ? btnOn : btnOff}`} onClick={() => setShowDept(p => !p)}>
					Department
				</button>
				<button className={`${btnBase} ${showSalary ? btnOn : btnOff}`} onClick={() => setShowSalary(p => !p)}>
					Salary
				</button>
				<span className="text-gray-300 mx-1">|</span>
				<span className="text-gray-500 text-xs">Name column:</span>
				<button className={`${btnBase} ${filterable ? btnOn : btnOff}`} onClick={() => setFilterable(p => !p)}>
					filterable
				</button>
			</div>
			<DataTable columns={columns} data={data} defaultSortFieldId="name" highlightOnHover dense />
		</div>
	);
}
