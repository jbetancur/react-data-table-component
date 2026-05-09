import React, { useState } from 'react';
import DataTable, { type TableColumn, type TableStyles, type ConditionalStyles } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	active: boolean;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, active: true },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, active: true },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, active: false },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, active: true },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, active: false },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, active: true },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
	},
	{
		name: 'Status',
		selector: r => r.active,
		cell: r => (
			<span
				style={{
					padding: '2px 8px',
					borderRadius: 12,
					fontSize: 11,
					fontWeight: 600,
					background: r.active ? '#dcfce7' : '#f3f4f6',
					color: r.active ? '#15803d' : '#6b7280',
				}}
			>
				{r.active ? 'Active' : 'Inactive'}
			</span>
		),
	},
];

const conditionalRowStyles: ConditionalStyles<Row>[] = [
	{
		when: row => row.salary > 140000,
		style: { backgroundColor: '#fefce8', borderLeft: '3px solid #eab308' },
	},
	{
		when: row => !row.active,
		style: { opacity: 0.5 },
	},
];

const customStyles: TableStyles = {
	headRow: {
		style: {
			backgroundColor: '#f0f4ff',
			fontWeight: 700,
		},
	},
	headCells: {
		style: {
			color: '#374151',
			fontSize: 13,
		},
	},
	rows: {
		style: {
			fontSize: 13,
		},
	},
};

type Mode = 'conditional' | 'custom';

export default function CustomStylesDemo() {
	const [mode, setMode] = useState<Mode>('conditional');

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3 text-sm">
				<span className="text-gray-500">Mode:</span>
				{(['conditional', 'custom'] as Mode[]).map(m => (
					<button
						key={m}
						onClick={() => setMode(m)}
						className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
							mode === m
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{m === 'conditional' ? 'Conditional row styles' : 'customStyles'}
					</button>
				))}
				{mode === 'conditional' && (
					<span className="text-gray-400 text-xs ml-2">Yellow highlight = salary &gt; $140k · Faded = inactive</span>
				)}
			</div>
			<DataTable
				columns={columns}
				data={data}
				conditionalRowStyles={mode === 'conditional' ? conditionalRowStyles : undefined}
				customStyles={mode === 'custom' ? customStyles : undefined}
				highlightOnHover
			/>
		</div>
	);
}
