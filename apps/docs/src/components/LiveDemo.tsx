import React, { useState, useCallback } from 'react';
import DataTable, { Media } from 'react-data-table-component';

const THEMES = ['default', 'material', 'rounded', 'catppuccin', 'adgrid-quartz'] as const;
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
	const [selectable, setSelectable] = useState(true);
	const [striped, setStriped] = useState(false);
	const [animateRows, setAnimateRows] = useState(true);
	const [selectedCount, setSelectedCount] = useState(0);

	const handleSelectedChange = useCallback(({ selectedCount }: { selectedCount: number }) => {
		setSelectedCount(selectedCount);
	}, []);

	const btnClass = (active: boolean) =>
		`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
			active
				? 'bg-brand-600 text-white border-brand-600'
				: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
		}`;

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-gray-500 font-medium shrink-0">Theme</span>
					{THEMES.map(t => (
						<button key={t} onClick={() => setTheme(t)} className={btnClass(theme === t)}>
							{t.charAt(0).toUpperCase() + t.slice(1)}
						</button>
					))}
				</div>

				<div className="flex items-center gap-3 ml-auto">
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
						Animate
					</label>

					{selectable && selectedCount > 0 && (
						<span className="text-brand-600 font-medium">{selectedCount} selected</span>
					)}
				</div>
			</div>

			{/* Table */}
			<DataTable
				columns={columns}
				data={data}
				theme={theme}
				colorMode="light"
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
	);
}
