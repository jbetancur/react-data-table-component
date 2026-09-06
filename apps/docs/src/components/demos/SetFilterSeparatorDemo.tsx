import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type FilterState } from 'react-data-table-component';

interface Project {
	id: number;
	name: string;
	stack: string;
}

// The stack is stored the way it reads in the cell: one string, comma separated.
const projects: Project[] = [
	{ id: 1, name: 'Checkout rewrite', stack: 'React, TypeScript' },
	{ id: 2, name: 'Billing service', stack: 'Go, Postgres' },
	{ id: 3, name: 'Design system', stack: 'React, Storybook, TypeScript' },
	{ id: 4, name: 'Data pipeline', stack: 'Python, Postgres' },
	{ id: 5, name: 'Marketing site', stack: 'Astro, TypeScript' },
	{ id: 6, name: 'Internal scripts', stack: '' },
];

const columns: TableColumn<Project>[] = [
	{ id: 'name', name: 'Project', selector: r => r.name, grow: 2 },
	{
		id: 'stack',
		name: 'Stack',
		selector: r => r.stack,
		filterable: true,
		filterType: 'set',
		filterOptions: { separator: ',' },
	},
];

export default function SetFilterSeparatorDemo() {
	const [filters, setFilters] = React.useState<Record<string | number, FilterState>>({});

	const selected = filters.stack?.values;

	return (
		<div className="flex flex-col gap-3">
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{selected === undefined
					? 'no filter applied. Open the Stack filter: each technology is listed on its own, not as "React, TypeScript"'
					: selected.length === 0
						? 'nothing selected, so no rows match'
						: `showing projects using any of [${selected.join(', ')}]`}
			</div>

			<DataTable
				columns={columns}
				data={projects}
				filterValues={filters}
				onFilterChange={(columnId, next) => setFilters(prev => ({ ...prev, [columnId]: next }))}
				highlightOnHover
			/>
		</div>
	);
}
