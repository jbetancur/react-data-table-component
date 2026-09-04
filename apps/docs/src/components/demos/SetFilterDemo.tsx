import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type FilterState } from 'react-data-table-component';

interface Incident {
	id: number;
	service: string;
	severity: string;
	owner: string;
	opened: string;
}

const data: Incident[] = [
	{ id: 1, service: 'auth', severity: 'critical', owner: 'Platform', opened: '2024-03-01' },
	{ id: 2, service: 'billing', severity: 'major', owner: 'Payments', opened: '2024-03-02' },
	{ id: 3, service: 'search', severity: 'minor', owner: 'Discovery', opened: '2024-03-02' },
	{ id: 4, service: 'auth', severity: 'major', owner: 'Platform', opened: '2024-03-04' },
	{ id: 5, service: 'cdn', severity: 'critical', owner: '', opened: '2024-03-05' },
	{ id: 6, service: 'billing', severity: 'minor', owner: 'Payments', opened: '2024-03-06' },
	{ id: 7, service: 'search', severity: 'major', owner: 'Discovery', opened: '2024-03-07' },
	{ id: 8, service: 'auth', severity: 'minor', owner: 'Platform', opened: '2024-03-08' },
	{ id: 9, service: 'cdn', severity: 'major', owner: '', opened: '2024-03-09' },
	{ id: 10, service: 'notifications', severity: 'critical', owner: 'Messaging', opened: '2024-03-10' },
	{ id: 11, service: 'billing', severity: 'critical', owner: 'Payments', opened: '2024-03-11' },
	{ id: 12, service: 'notifications', severity: 'minor', owner: 'Messaging', opened: '2024-03-12' },
];

const columns: TableColumn<Incident>[] = [
	{
		id: 'service',
		name: 'Service',
		selector: r => r.service,
		sortable: true,
		filterable: true,
		filterType: 'set',
	},
	{
		id: 'severity',
		name: 'Severity',
		selector: r => r.severity,
		sortable: true,
		filterable: true,
		filterType: 'set',
	},
	{
		// Two rows have no owner, so they show up as "(Blanks)" in the checklist.
		id: 'owner',
		name: 'Owner',
		selector: r => r.owner,
		sortable: true,
		filterable: true,
		filterType: 'set',
	},
	{
		id: 'opened',
		name: 'Opened',
		selector: r => r.opened,
		sortable: true,
		filterable: true,
		filterType: 'date',
	},
];

function describe(filters: Record<string | number, FilterState>) {
	const active = Object.entries(filters).filter(([, f]) => f.values !== undefined);
	if (active.length === 0) return 'no set filter applied. Open a Service, Severity, or Owner filter';
	return active
		.map(([id, f]) => `${id}: [${(f.values ?? []).map(v => (v === '' ? '(Blanks)' : v)).join(', ')}]`)
		.join('  ·  ');
}

export default function SetFilterDemo() {
	const [filters, setFilters] = React.useState<Record<string | number, FilterState>>({});

	return (
		<div className="flex flex-col gap-3">
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{describe(filters)}
			</div>

			<DataTable
				columns={columns}
				data={data}
				filterValues={filters}
				onFilterChange={(columnId, next) => setFilters(prev => ({ ...prev, [columnId]: next }))}
				highlightOnHover
				defaultSortFieldId="service"
			/>
		</div>
	);
}
