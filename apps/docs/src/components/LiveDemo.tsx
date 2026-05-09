import React, { useState, useCallback } from 'react';
import DataTable, { Media } from 'react-data-table-component';

const THEMES = [
	'default',
	'dark',
	'material',
	'material-dark',
	'slate',
	'slate-dark',
	'ocean',
	'ocean-dark',
	'midnight',
] as const;
type Theme = (typeof THEMES)[number];

const data = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', department: 'Engineering', salary: 155000, status: 'Active' },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', department: 'Product', salary: 132000, status: 'Active' },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', department: 'Design', salary: 118000, status: 'Remote' },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', department: 'Analytics', salary: 143000, status: 'Active' },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', department: 'Engineering', salary: 128000, status: 'Active' },
	{ id: 6, name: 'Taylor Brooks', role: 'Account Manager', department: 'Sales', salary: 97000, status: 'On Leave' },
	{
		id: 7,
		name: 'Casey Morgan',
		role: 'Backend Engineer',
		department: 'Engineering',
		salary: 138000,
		status: 'Active',
	},
	{ id: 8, name: 'Alex Kim', role: 'UX Researcher', department: 'Design', salary: 112000, status: 'Remote' },
];

const statusColor: Record<string, string> = {
	Active: 'bg-green-100 text-green-700',
	Remote: 'bg-blue-100 text-blue-700',
	'On Leave': 'bg-yellow-100 text-yellow-700',
};

const columns = [
	{
		name: 'Name',
		selector: (row: (typeof data)[0]) => row.name,
		sortable: true,
		grow: 1.4,
	},
	{
		name: 'Role',
		selector: (row: (typeof data)[0]) => row.role,
		sortable: true,
		hide: Media.SM,
	},
	{
		name: 'Department',
		selector: (row: (typeof data)[0]) => row.department,
		sortable: true,
		hide: Media.MD,
	},
	{
		name: 'Salary',
		selector: (row: (typeof data)[0]) => row.salary,
		sortable: true,
		format: (row: (typeof data)[0]) => `$${row.salary.toLocaleString()}`,
		right: true,
	},
	{
		name: 'Status',
		selector: (row: (typeof data)[0]) => row.status,
		cell: (row: (typeof data)[0]) => (
			<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[row.status] ?? ''}`}>
				{row.status}
			</span>
		),
	},
];

export default function LiveDemo() {
	const [theme, setTheme] = useState<Theme>('default');
	const [selectable, setSelectable] = useState(false);
	const [striped, setStriped] = useState(true);
	const [animateRows, setAnimateRows] = useState(true);
	const [selectedCount, setSelectedCount] = useState(0);

	const handleSelectedChange = useCallback(({ selectedCount }: { selectedCount: number }) => {
		setSelectedCount(selectedCount);
	}, []);

	const isDark = theme.includes('dark') || theme === 'midnight';

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm">
				<div className="flex items-center gap-2">
					<label htmlFor="live-demo-theme" className="text-gray-500 font-medium">
						Theme
					</label>
					<select
						id="live-demo-theme"
						value={theme}
						onChange={e => setTheme(e.target.value as Theme)}
						className="border border-gray-200 rounded-md px-2 py-1 text-gray-700 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
					>
						{THEMES.map(t => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>

				<label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={selectable}
						onChange={e => setSelectable(e.target.checked)}
						className="rounded"
					/>
					Selectable
				</label>

				<label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
					<input type="checkbox" checked={striped} onChange={e => setStriped(e.target.checked)} className="rounded" />
					Striped
				</label>

				<label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={animateRows}
						onChange={e => setAnimateRows(e.target.checked)}
						className="rounded"
					/>
					Animate rows
				</label>

				{selectable && selectedCount > 0 && (
					<span className="ml-auto text-brand-600 font-medium">{selectedCount} selected</span>
				)}
			</div>

			{/* Table */}
			<div className={isDark ? 'bg-gray-900' : 'bg-white'}>
				<DataTable
					columns={columns}
					data={data}
					theme={theme}
					striped={striped}
					highlightOnHover
					selectableRows={selectable}
					onSelectedRowsChange={handleSelectedChange}
					animateRows={animateRows}
					pagination
					paginationPerPage={5}
					paginationRowsPerPageOptions={[5, 8]}
				/>
			</div>
		</div>
	);
}
