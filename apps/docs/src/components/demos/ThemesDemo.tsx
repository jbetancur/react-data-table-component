import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type ColorMode } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	department: string;
	salary: number;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', department: 'Engineering', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', role: 'Account Executive', department: 'Sales', salary: 97000 },
	{ id: 7, name: 'Morgan Lee', role: 'QA Engineer', department: 'Engineering', salary: 112000 },
	{ id: 8, name: 'Casey Kim', role: 'Data Engineer', department: 'Analytics', salary: 138000 },
	{ id: 9, name: 'Riley Park', role: 'Frontend Engineer', department: 'Engineering', salary: 121000 },
	{ id: 10, name: 'Devon Walsh', role: 'Backend Engineer', department: 'Engineering', salary: 134000 },
	{ id: 11, name: 'Quinn Torres', role: 'UX Researcher', department: 'Design', salary: 109000 },
	{ id: 12, name: 'Avery Nguyen', role: 'Sales Engineer', department: 'Sales', salary: 115000 },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
		sortable: true,
	},
];

const THEMES = ['default', 'material', 'rounded', 'aggrid', 'catppuccin'] as const;
type ThemeName = (typeof THEMES)[number];

const COLOR_MODES: { id: ColorMode; label: string }[] = [
	{ id: 'system', label: 'System' },
	{ id: 'light', label: 'Light' },
	{ id: 'dark', label: 'Dark' },
];

function RowDetail({ data: row }: { data: Row }) {
	return (
		<div style={{ padding: '10px 16px', fontSize: 13, opacity: 0.75 }}>
			{row.name} · {row.role} · {row.department}
		</div>
	);
}

export default function ThemesDemo() {
	const [theme, setTheme] = useState<ThemeName>('default');
	const [colorMode, setColorMode] = useState<ColorMode>('system');

	const btnClass = (active: boolean) =>
		`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
			active
				? 'bg-brand-600 text-white border-brand-600'
				: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
		}`;

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs font-semibold text-gray-400 w-20 shrink-0">Theme</span>
					{THEMES.map(t => (
						<button key={t} onClick={() => setTheme(t)} className={btnClass(theme === t)}>
							{t.charAt(0).toUpperCase() + t.slice(1)}
						</button>
					))}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-gray-400 w-20 shrink-0">Color mode</span>
					{COLOR_MODES.map(m => (
						<button key={m.id} onClick={() => setColorMode(m.id)} className={btnClass(colorMode === m.id)}>
							{m.label}
						</button>
					))}
					{colorMode === 'system' && <span className="text-xs text-gray-400">follows the page toggle above</span>}
				</div>
			</div>

			<DataTable
				columns={columns}
				data={data}
				theme={theme}
				colorMode={colorMode}
				keyField="id"
				selectableRows
				highlightOnHover
				expandableRows
				expandableRowsComponent={RowDetail}
				pagination
				paginationPerPage={5}
			/>
		</div>
	);
}
