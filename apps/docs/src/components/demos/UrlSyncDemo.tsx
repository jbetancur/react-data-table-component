import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { type FilterState, SortOrder, type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
	salary: number;
}

const ALL_DATA: Employee[] = [
	{ id: 1,  name: 'Aria Chen',      department: 'Engineering', role: 'Engineering Lead',  salary: 155000 },
	{ id: 2,  name: 'Marcus Webb',    department: 'Product',     role: 'Product Manager',   salary: 132000 },
	{ id: 3,  name: 'Priya Kapoor',   department: 'Design',      role: 'Senior Designer',   salary: 118000 },
	{ id: 4,  name: 'Jordan Ellis',   department: 'Analytics',   role: 'Data Scientist',    salary: 143000 },
	{ id: 5,  name: 'Sam Rivera',     department: 'Engineering', role: 'DevOps Engineer',   salary: 128000 },
	{ id: 6,  name: 'Taylor Brooks',  department: 'Sales',       role: 'Account Manager',   salary: 97000  },
	{ id: 7,  name: 'Casey Morgan',   department: 'Engineering', role: 'Software Engineer', salary: 138000 },
	{ id: 8,  name: 'Alex Kim',       department: 'Design',      role: 'UX Researcher',     salary: 112000 },
	{ id: 9,  name: 'Dana Park',      department: 'Product',     role: 'Product Designer',  salary: 125000 },
	{ id: 10, name: 'Riley Stone',    department: 'Sales',       role: 'Sales Rep',         salary: 104000 },
	{ id: 11, name: 'Quinn Adams',    department: 'Analytics',   role: 'Data Engineer',     salary: 137000 },
	{ id: 12, name: 'Morgan Lee',     department: 'Engineering', role: 'Backend Engineer',  salary: 149000 },
];

// --- URL <-> state helpers ---

function readParams(): { sortId: string; sortDir: SortOrder; page: number; perPage: number; filters: Record<string, string> } {
	const p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	return {
		sortId:  p.get('sort') ?? '',
		sortDir: p.get('dir') === 'desc' ? SortOrder.DESC : SortOrder.ASC,
		page:    parseInt(p.get('page') ?? '1', 10),
		perPage: parseInt(p.get('per') ?? '5', 10),
		filters: Object.fromEntries(
			[...p.entries()]
				.filter(([k]) => k.startsWith('f_'))
				.map(([k, v]) => [k.slice(2), v]),
		),
	};
}

function writeParams(state: { sortId: string; sortDir: SortOrder; page: number; perPage: number; filters: Record<string, string> }) {
	const p = new URLSearchParams();
	if (state.sortId) { p.set('sort', state.sortId); p.set('dir', state.sortDir === SortOrder.DESC ? 'desc' : 'asc'); }
	if (state.page > 1) p.set('page', String(state.page));
	if (state.perPage !== 5) p.set('per', String(state.perPage));
	Object.entries(state.filters).forEach(([k, v]) => { if (v) p.set(`f_${k}`, v); });
	const qs = p.toString();
	history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

// --- Component ---

export default function UrlSyncDemo() {
	const init = useMemo(() => readParams(), []);

	const [sortId,  setSortId]  = useState(init.sortId);
	const [sortDir, setSortDir] = useState(init.sortDir);
	const [page,    setPage]    = useState(init.page);
	const [perPage, setPerPage] = useState(init.perPage);
	const [filters, setFilters] = useState<Record<string, FilterState>>(() =>
		Object.fromEntries(
			Object.entries(init.filters).map(([k, v]) => [k, { value: v, operator: 'contains' as const, condition2: null, join: 'and' as const }]),
		),
	);

	// Sync every state change to the URL
	useEffect(() => {
		writeParams({
			sortId, sortDir, page, perPage,
			filters: Object.fromEntries(
				Object.entries(filters).map(([k, f]) => [k, String(f.value ?? '')]).filter(([, v]) => v),
			),
		});
	}, [sortId, sortDir, page, perPage, filters]);

	const handleSort = useCallback((col: TableColumn<Employee>, dir: SortOrder) => {
		setSortId(col.id as string);
		setSortDir(dir);
		setPage(1);
	}, []);

	const handleFilterChange = useCallback((columnId: string | number, next: FilterState) => {
		setFilters(prev => ({ ...prev, [columnId]: next }));
		setPage(1);
	}, []);

	const columns: TableColumn<Employee>[] = [
		{ id: 'name',       name: 'Name',       selector: r => r.name,       sortable: true, filterable: true, grow: 1 },
		{ id: 'department', name: 'Department', selector: r => r.department, sortable: true, filterable: true },
		{ id: 'role',       name: 'Role',       selector: r => r.role,       sortable: true, grow: 1 },
		{ id: 'salary',     name: 'Salary',     selector: r => r.salary,     sortable: true, right: true, width: '110px',
			format: r => `$${r.salary.toLocaleString()}` },
	];

	// Show current URL params so the demo is self-explanatory
	const [urlDisplay, setUrlDisplay] = useState('');
	useEffect(() => {
		setUrlDisplay(window.location.search || '(no params — default state)');
	}, [sortId, sortDir, page, perPage, filters]);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-500 overflow-x-auto">
				<span className="text-gray-400 shrink-0">URL params:</span>
				<span className="text-gray-700">{urlDisplay}</span>
			</div>
			<DataTable
				columns={columns}
				data={ALL_DATA}
				sortServer
				defaultSortFieldId={sortId || undefined}
				defaultSortAsc={sortDir === SortOrder.ASC}
				onSort={handleSort}
				filterValues={filters}
				onFilterChange={handleFilterChange}
				pagination
				paginationDefaultPage={page}
				paginationPerPage={perPage}
				onChangePage={p => setPage(p)}
				onChangeRowsPerPage={(pp, p) => { setPerPage(pp); setPage(p); }}
				highlightOnHover
			/>
		</div>
	);
}
