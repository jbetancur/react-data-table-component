import React, { useState, useCallback } from 'react';
import DataTable, { Media } from 'react-data-table-component';

const THEMES = ['default', 'material', 'rounded', 'catppuccin', 'crisp'] as const;
type Theme = (typeof THEMES)[number];

type Row = {
	id: number;
	name: string;
	role: string;
	department: string;
	salary: number;
	status: string;
};

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', department: 'Engineering', salary: 155000, status: 'Active' },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', department: 'Product', salary: 132000, status: 'On Leave' },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', department: 'Design', salary: 118000, status: 'Remote' },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', department: 'Analytics', salary: 143000, status: 'Active' },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', department: 'Engineering', salary: 128000, status: 'Remote' },
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
		id: 'name',
		name: 'Name',
		selector: (row: Row) => row.name,
		sortable: true,
		filterable: true,
		reorder: true,
		grow: 1.4,
	},
	{
		id: 'role',
		name: 'Role',
		selector: (row: Row) => row.role,
		sortable: true,
		filterable: true,
		reorder: true,
		hide: Media.SM,
	},
	{
		id: 'department',
		name: 'Department',
		selector: (row: Row) => row.department,
		sortable: true,
		filterable: true,
		reorder: true,
		hide: Media.MD,
	},
	{
		id: 'salary',
		name: 'Salary',
		selector: (row: Row) => row.salary,
		sortable: true,
		filterable: true,
		filterType: 'number' as const,
		reorder: true,
		format: (row: Row) => `$${row.salary.toLocaleString()}`,
		right: true,
	},
	{
		id: 'status',
		name: 'Status',
		selector: (row: Row) => row.status,
		filterable: true,
		reorder: true,
		cell: (row: Row) => (
			<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[row.status] ?? ''}`}>
				{row.status}
			</span>
		),
	},
];

function ExpandedRow({ data }: { data: Row }) {
	return (
		<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 grid grid-cols-2 gap-x-8 gap-y-1.5">
			<div><span className="font-medium text-gray-700">Department:</span> {data.department}</div>
			<div><span className="font-medium text-gray-700">Status:</span> {data.status}</div>
			<div><span className="font-medium text-gray-700">Salary:</span> ${data.salary.toLocaleString()}</div>
			<div><span className="font-medium text-gray-700">Role:</span> {data.role}</div>
		</div>
	);
}

export default function LiveDemo() {
	const [theme, setTheme] = useState<Theme>('default');
	const [selectable, setSelectable] = useState(true);
	const [expandable, setExpandable] = useState(false);
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

	const toggleClass = (active: boolean) =>
		`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
			active ? 'bg-brand-600' : 'bg-gray-200'
		}`;

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm">
				{/* Theme row */}
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-gray-500 font-medium shrink-0">Theme</span>
					{THEMES.map(t => (
						<button key={t} onClick={() => setTheme(t)} className={btnClass(theme === t)}>
							{t.charAt(0).toUpperCase() + t.slice(1)}
						</button>
					))}
				</div>

				{/* Toggles row */}
				<div className="flex items-center gap-4 flex-wrap">
					{([
						['Selectable', selectable, setSelectable],
						['Expandable', expandable, setExpandable],
						['Striped', striped, setStriped],
						['Animate', animateRows, setAnimateRows],
					] as [string, boolean, (v: boolean) => void][]).map(([label, value, setter]) => (
						<label key={label} className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
							<button
								role="switch"
								aria-checked={value}
								onClick={() => setter(!value)}
								className={toggleClass(value)}
							>
								<span className={`pointer-events-none block h-3 w-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-3' : 'translate-x-0'}`} />
							</button>
							{label}
						</label>
					))}

					{selectable && selectedCount > 0 && (
						<span className="text-brand-600 font-medium shrink-0 ml-auto">{selectedCount} selected</span>
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
				expandableRows={expandable}
				expandableRowsComponent={ExpandedRow}
				animateRows={animateRows}
				resizable
				pagination
				paginationPerPage={5}
				paginationRowsPerPageOptions={[5, 8]}
			/>
		</div>
	);
}
