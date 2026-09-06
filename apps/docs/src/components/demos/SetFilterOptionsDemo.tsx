import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type FilterState } from 'react-data-table-component';

interface Ticket {
	id: number;
	subject: string;
	status: string;
}

const STATUSES = ['Active', 'Pending', 'Closed', 'Archived'];

// Stands in for the server. Only Active and Pending tickets are on the first page,
// so deriving the checklist from the loaded rows would never offer the other two.
const everything: Ticket[] = [
	{ id: 1, subject: 'Login loop on SSO', status: 'Active' },
	{ id: 2, subject: 'Invoice PDF is blank', status: 'Active' },
	{ id: 3, subject: 'Webhook retries stall', status: 'Pending' },
	{ id: 4, subject: 'Export times out', status: 'Pending' },
	{ id: 5, subject: 'Password reset email', status: 'Closed' },
	{ id: 6, subject: 'Duplicate charge', status: 'Closed' },
	{ id: 7, subject: 'Legacy API sunset', status: 'Archived' },
];

const firstPage = everything.filter(t => t.status === 'Active' || t.status === 'Pending');

const columns: TableColumn<Ticket>[] = [
	{ id: 'subject', name: 'Subject', selector: r => r.subject, grow: 2 },
	{
		id: 'status',
		name: 'Status',
		selector: r => r.status,
		filterable: true,
		filterType: 'set',
		filterOptions: { values: STATUSES },
	},
];

export default function SetFilterOptionsDemo() {
	const [rows, setRows] = React.useState<Ticket[]>(firstPage);
	const [filters, setFilters] = React.useState<Record<string | number, FilterState>>({});
	const [loading, setLoading] = React.useState(false);

	function handleFilterChange(columnId: string | number, next: FilterState) {
		setFilters(prev => ({ ...prev, [columnId]: next }));

		// What a real fetch would do: send the selection, render whatever comes back.
		setLoading(true);
		const selected = next.values;
		window.setTimeout(() => {
			setRows(selected === undefined ? firstPage : everything.filter(t => selected.includes(t.status)));
			setLoading(false);
		}, 300);
	}

	const selected = filters.status?.values;

	return (
		<div className="flex flex-col gap-3">
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{selected === undefined
					? 'no filter applied. Open the Status filter: all four statuses are listed, though only Active and Pending are loaded'
					: `requested [${selected.join(', ')}] from the server`}
			</div>

			<DataTable
				columns={columns}
				data={rows}
				filterServer
				filterValues={filters}
				onFilterChange={handleFilterChange}
				progressPending={loading}
				highlightOnHover
			/>
		</div>
	);
}
