import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type ConditionalStyles } from 'react-data-table-component';

interface Deal {
	id: number;
	company: string;
	rep: string;
	value: number;
	stage: 'Prospect' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
	daysOpen: number;
}

const data: Deal[] = [
	{ id: 1, company: 'Acme Corp', rep: 'Aria Chen', value: 84000, stage: 'Closed Won', daysOpen: 42 },
	{ id: 2, company: 'Globex Inc', rep: 'Marcus Webb', value: 210000, stage: 'Negotiation', daysOpen: 67 },
	{ id: 3, company: 'Initech LLC', rep: 'Priya Kapoor', value: 15000, stage: 'Prospect', daysOpen: 8 },
	{ id: 4, company: 'Umbrella Ltd', rep: 'Jordan Ellis', value: 520000, stage: 'Proposal', daysOpen: 120 },
	{ id: 5, company: 'Soylent GmbH', rep: 'Sam Rivera', value: 38000, stage: 'Closed Lost', daysOpen: 95 },
	{ id: 6, company: 'Massive Dynamic', rep: 'Taylor Brooks', value: 175000, stage: 'Closed Won', daysOpen: 33 },
	{ id: 7, company: 'Vandelay Ind', rep: 'Aria Chen', value: 62000, stage: 'Negotiation', daysOpen: 89 },
];

const fmt = (v: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

const stageColors: Record<Deal['stage'], string> = {
	Prospect: '#6b7280',
	Proposal: '#2563eb',
	Negotiation: '#d97706',
	'Closed Won': '#16a34a',
	'Closed Lost': '#dc2626',
};

const columns: TableColumn<Deal>[] = [
	{ name: 'Company', selector: r => r.company, sortable: true, grow: 2 },
	{ name: 'Rep', selector: r => r.rep, sortable: true },
	{
		name: 'Value',
		selector: r => r.value,
		format: r => fmt(r.value),
		sortable: true,
		right: true,
		conditionalCellStyles: [
			{ when: r => r.value >= 200000, style: { fontWeight: 700, color: '#15803d' } },
			{ when: r => r.value < 20000, style: { color: '#9ca3af' } },
		],
	},
	{
		name: 'Stage',
		cell: r => <span style={{ color: stageColors[r.stage], fontWeight: 600, fontSize: 13 }}>{r.stage}</span>,
		sortable: true,
		selector: r => r.stage,
	},
	{
		name: 'Days open',
		selector: r => r.daysOpen,
		sortable: true,
		right: true,
		conditionalCellStyles: [
			{ when: r => r.daysOpen > 90, style: { color: '#dc2626', fontWeight: 700 } },
			{ when: r => r.daysOpen > 60, style: { color: '#d97706' } },
		],
	},
];

const conditionalRowStyles: ConditionalStyles<Deal>[] = [
	{
		when: r => r.stage === 'Closed Won',
		style: { backgroundColor: '#f0fdf4', borderLeft: '3px solid #16a34a' },
	},
	{
		when: r => r.stage === 'Closed Lost',
		style: { backgroundColor: '#fef2f2', opacity: 0.75 },
	},
];

export default function ConditionalStylesDemo() {
	return (
		<DataTable
			columns={columns}
			data={data}
			conditionalRowStyles={conditionalRowStyles}
			highlightOnHover
			defaultSortFieldId={2}
			defaultSortAsc={false}
		/>
	);
}
