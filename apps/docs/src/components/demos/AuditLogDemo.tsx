import React, { useState } from 'react';
import DataTable, { type ConditionalStyles, type TableColumn } from 'react-data-table-component';

type Severity = 'info' | 'warning' | 'error' | 'critical';

interface LogEntry {
	id: number;
	timestamp: string;
	severity: Severity;
	user: string;
	action: string;
	resource: string;
	ip: string;
}

const SEVERITY_STYLE: Record<Severity, string> = {
	info:     'bg-blue-50 text-blue-700 border border-blue-100',
	warning:  'bg-yellow-50 text-yellow-700 border border-yellow-100',
	error:    'bg-red-50 text-red-700 border border-red-100',
	critical: 'bg-red-100 text-red-900 border border-red-300 font-bold',
};

const ALL_LOGS: LogEntry[] = [
	{ id: 1,  timestamp: '2024-05-16 09:01:12', severity: 'info',     user: 'aria.chen',    action: 'LOGIN',           resource: '/dashboard',         ip: '10.0.1.42'  },
	{ id: 2,  timestamp: '2024-05-16 09:03:44', severity: 'info',     user: 'marcus.webb',  action: 'VIEW',            resource: '/reports/q1',        ip: '10.0.1.18'  },
	{ id: 3,  timestamp: '2024-05-16 09:12:05', severity: 'warning',  user: 'aria.chen',    action: 'EXPORT',          resource: '/users/all',         ip: '10.0.1.42'  },
	{ id: 4,  timestamp: '2024-05-16 09:15:30', severity: 'error',    user: 'unknown',      action: 'LOGIN_FAILED',    resource: '/auth',              ip: '203.0.113.7' },
	{ id: 5,  timestamp: '2024-05-16 09:15:31', severity: 'error',    user: 'unknown',      action: 'LOGIN_FAILED',    resource: '/auth',              ip: '203.0.113.7' },
	{ id: 6,  timestamp: '2024-05-16 09:15:32', severity: 'critical', user: 'unknown',      action: 'BRUTE_FORCE',     resource: '/auth',              ip: '203.0.113.7' },
	{ id: 7,  timestamp: '2024-05-16 09:22:18', severity: 'info',     user: 'priya.kapoor', action: 'UPDATE',          resource: '/settings/theme',    ip: '10.0.1.55'  },
	{ id: 8,  timestamp: '2024-05-16 09:31:00', severity: 'warning',  user: 'jordan.ellis', action: 'DELETE',          resource: '/reports/draft-4',   ip: '10.0.2.11'  },
	{ id: 9,  timestamp: '2024-05-16 09:45:09', severity: 'info',     user: 'sam.rivera',   action: 'DEPLOY',          resource: '/infra/staging',     ip: '10.0.1.99'  },
	{ id: 10, timestamp: '2024-05-16 10:02:44', severity: 'critical', user: 'system',       action: 'DB_CONN_LOST',    resource: '/db/primary',        ip: '10.0.0.1'   },
	{ id: 11, timestamp: '2024-05-16 10:03:01', severity: 'critical', user: 'system',       action: 'FAILOVER',        resource: '/db/replica',        ip: '10.0.0.2'   },
	{ id: 12, timestamp: '2024-05-16 10:15:22', severity: 'info',     user: 'aria.chen',    action: 'LOGOUT',          resource: '/auth',              ip: '10.0.1.42'  },
	{ id: 13, timestamp: '2024-05-16 10:28:33', severity: 'warning',  user: 'taylor.brooks',action: 'PERMISSION_DENY', resource: '/admin/users',       ip: '10.0.1.77'  },
	{ id: 14, timestamp: '2024-05-16 10:55:50', severity: 'error',    user: 'system',       action: 'DISK_FULL',       resource: '/storage/logs',      ip: '10.0.0.5'   },
	{ id: 15, timestamp: '2024-05-16 11:10:04', severity: 'info',     user: 'marcus.webb',  action: 'LOGIN',           resource: '/dashboard',         ip: '10.0.1.18'  },
];

const SEVERITIES: ('all' | Severity)[] = ['all', 'info', 'warning', 'error', 'critical'];

const conditionalRowStyles: ConditionalStyles<LogEntry>[] = [
	{ when: r => r.severity === 'critical', style: { backgroundColor: '#fef2f2' } },
	{ when: r => r.severity === 'error',    style: { backgroundColor: '#fff7f7' } },
];

const columns: TableColumn<LogEntry>[] = [
	{ id: 'timestamp', name: 'Timestamp', selector: r => r.timestamp, sortable: true, width: '175px' },
	{
		id: 'severity',
		name: 'Severity',
		selector: r => r.severity,
		sortable: true,
		width: '110px',
		cell: r => (
			<span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_STYLE[r.severity]}`}>
				{r.severity}
			</span>
		),
	},
	{ id: 'user',     name: 'User',     selector: r => r.user,     sortable: true, width: '145px' },
	{ id: 'action',   name: 'Action',   selector: r => r.action,   sortable: true, width: '145px', style: { fontFamily: 'monospace', fontSize: 12 } },
	{ id: 'resource', name: 'Resource', selector: r => r.resource, grow: 1,        style: { fontFamily: 'monospace', fontSize: 12 } },
	{ id: 'ip',       name: 'IP',       selector: r => r.ip,       width: '130px', style: { fontFamily: 'monospace', fontSize: 12 } },
];

export default function AuditLogDemo() {
	const [severity, setSeverity] = useState<'all' | Severity>('all');
	const [search, setSearch] = useState('');

	const filtered = ALL_LOGS.filter(r => {
		if (severity !== 'all' && r.severity !== severity) return false;
		if (search) {
			const q = search.toLowerCase();
			return r.user.includes(q) || r.action.includes(q) || r.resource.includes(q) || r.ip.includes(q);
		}
		return true;
	});

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 flex-wrap">
				<input
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search user, action, resource, IP…"
					className="px-3 py-1.5 text-xs border border-gray-200 rounded-md w-56 focus:outline-none focus:border-gray-400"
				/>
				<div className="flex gap-1 ml-auto">
					{SEVERITIES.map(s => (
						<button
							key={s}
							onClick={() => setSeverity(s)}
							className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
								severity === s
									? 'bg-gray-800 border-gray-800 text-white'
									: 'border-gray-200 text-gray-500 hover:border-gray-300'
							}`}
						>
							{s}
						</button>
					))}
				</div>
			</div>
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					columns={columns}
					data={filtered}
					conditionalRowStyles={conditionalRowStyles}
					fixedHeader
					fixedHeaderScrollHeight="340px"
					defaultSortFieldId="timestamp"
					highlightOnHover
					dense
					noDataComponent={<div className="py-8 text-sm text-gray-400">No matching log entries</div>}
				/>
			</div>
		</div>
	);
}
