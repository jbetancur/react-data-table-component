import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	salary: number;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', role: 'Engineering Lead', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', role: 'Product Manager', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', role: 'DevOps Engineer', salary: 128000 },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Role', selector: r => r.role },
	{
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
		sortable: true,
	},
];

const THEMES = [
	{ id: 'default', label: 'Default', dark: false },
	{ id: 'dark', label: 'Dark', dark: true },
	{ id: 'material', label: 'Material', dark: false },
	{ id: 'material-dark', label: 'Material Dark', dark: true },
	{ id: 'slate', label: 'Slate', dark: false },
	{ id: 'slate-dark', label: 'Slate Dark', dark: true },
	{ id: 'ocean', label: 'Ocean', dark: false },
	{ id: 'ocean-dark', label: 'Ocean Dark', dark: true },
	{ id: 'midnight', label: 'Midnight', dark: true },
	{ id: 'solarized', label: 'Solarized', dark: true },
] as const;

export default function ThemesDemo() {
	const [theme, setTheme] = useState<string>('default');
	const current = THEMES.find(t => t.id === theme);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{THEMES.map(t => (
					<button
						key={t.id}
						onClick={() => setTheme(t.id)}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
							theme === t.id
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{t.label}
					</button>
				))}
			</div>
			<div className={current?.dark ? 'bg-gray-900 rounded-xl overflow-hidden' : ''}>
				<DataTable columns={columns} data={data} theme={theme} striped highlightOnHover columnSeparator />
			</div>
		</div>
	);
}
