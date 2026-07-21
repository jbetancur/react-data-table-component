import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface LogEntry {
	id: number;
	service: string;
	level: 'info' | 'warn' | 'error';
	message: string;
	// Full ISO timestamps spanning several days — the time filter reads the
	// time-of-day and ignores the date, so a window matches across all of them.
	at: string;
}

const data: LogEntry[] = [
	{ id: 1, service: 'auth', level: 'info', message: 'session started', at: '2024-03-01T08:12:04' },
	{ id: 2, service: 'billing', level: 'warn', message: 'retry scheduled', at: '2024-03-01T23:41:19' },
	{ id: 3, service: 'cron', level: 'error', message: 'nightly job failed', at: '2024-03-02T02:15:00' },
	{ id: 4, service: 'api', level: 'info', message: 'request handled', at: '2024-03-02T13:05:47' },
	{ id: 5, service: 'cron', level: 'error', message: 'nightly job failed', at: '2024-03-03T02:47:31' },
	{ id: 6, service: 'auth', level: 'info', message: 'session started', at: '2024-03-03T09:30:12' },
	{ id: 7, service: 'billing', level: 'warn', message: 'card declined', at: '2024-03-03T17:58:00' },
	{ id: 8, service: 'cron', level: 'error', message: 'nightly job failed', at: '2024-03-04T03:22:09' },
	{ id: 9, service: 'api', level: 'info', message: 'request handled', at: '2024-03-04T21:14:55' },
	{ id: 10, service: 'auth', level: 'warn', message: 'rate limited', at: '2024-03-05T00:38:41' },
];

const levelColor: Record<LogEntry['level'], string> = {
	info: 'var(--rdt-color-text-muted, #64748b)',
	warn: '#b45309',
	error: '#dc2626',
};

const columns: TableColumn<LogEntry>[] = [
	{
		id: 'at',
		name: 'Time',
		selector: r => r.at,
		format: r => r.at.slice(11),
		sortable: true,
		filterable: true,
		filterType: 'time',
	},
	{ id: 'service', name: 'Service', selector: r => r.service, sortable: true, filterable: true },
	{
		id: 'level',
		name: 'Level',
		selector: r => r.level,
		cell: r => <span style={{ color: levelColor[r.level], fontWeight: 600 }}>{r.level}</span>,
		sortable: true,
		filterable: true,
	},
	{ id: 'message', name: 'Message', selector: r => r.message, grow: 2 },
];

export default function TimeFilterDemo() {
	return <DataTable columns={columns} data={data} highlightOnHover defaultSortFieldId="at" dense />;
}
