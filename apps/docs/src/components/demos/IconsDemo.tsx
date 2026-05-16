import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

// Inline SVG icon primitives — no external dependency
const ChevronLeft = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="15 18 9 12 15 6" />
	</svg>
);
const ChevronRight = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="9 18 15 12 9 6" />
	</svg>
);
const ChevronsLeft = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="11 17 6 12 11 7" />
		<polyline points="18 17 13 12 18 7" />
	</svg>
);
const ChevronsRight = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="13 17 18 12 13 7" />
		<polyline points="6 17 11 12 6 7" />
	</svg>
);
const ChevronDown = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="6 9 12 15 18 9" />
	</svg>
);
const ChevronRightSmall = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="9 18 15 12 9 6" />
	</svg>
);
const ArrowUp = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<line x1="12" y1="19" x2="12" y2="5" />
		<polyline points="5 12 12 5 19 12" />
	</svg>
);

interface Employee {
	id: number;
	name: string;
	role: string;
	department: string;
	bio: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen',    role: 'Engineering Lead', department: 'Engineering', bio: 'Leads the platform team with a focus on reliability.' },
	{ id: 2, name: 'Marcus Webb',  role: 'Product Manager',  department: 'Product',     bio: 'Drives roadmap strategy across three product lines.' },
	{ id: 3, name: 'Priya Kapoor', role: 'Senior Designer',  department: 'Design',      bio: 'Owns the design system and mobile experience.' },
	{ id: 4, name: 'Jordan Ellis', role: 'Data Scientist',   department: 'Analytics',   bio: 'Builds ML pipelines for churn and revenue forecasting.' },
	{ id: 5, name: 'Sam Rivera',   role: 'SRE',              department: 'Engineering', bio: 'Manages uptime, incidents, and deployment pipelines.' },
	{ id: 6, name: 'Taylor Brooks',role: 'Sales Lead',       department: 'Sales',       bio: 'Responsible for enterprise accounts in EMEA.' },
	{ id: 7, name: 'Casey Morgan', role: 'HR Manager',       department: 'HR',          bio: 'Owns hiring, onboarding, and culture initiatives.' },
	{ id: 8, name: 'Alex Kim',     role: 'Staff Engineer',   department: 'Engineering', bio: 'Architect for the data platform and internal APIs.' },
	{ id: 9, name: 'Morgan Lee',   role: 'Designer',         department: 'Design',      bio: 'Works on user research and prototype validation.' },
	{ id:10, name: 'Drew Park',    role: 'Analyst',          department: 'Analytics',   bio: 'Produces dashboards and weekly business metrics.' },
	{ id:11, name: 'Riley Nguyen', role: 'Frontend Eng',    department: 'Engineering', bio: 'Builds customer-facing product surfaces in React.' },
	{ id:12, name: 'Jamie Okafor', role: 'Backend Eng',     department: 'Engineering', bio: 'Maintains the microservices and event bus.' },
];

const columns: TableColumn<Employee>[] = [
	{ name: 'Name',       selector: r => r.name,       sortable: true },
	{ name: 'Role',       selector: r => r.role },
	{ name: 'Department', selector: r => r.department, sortable: true },
];

type Mode = 'default' | 'custom-pagination' | 'custom-expander' | 'custom-sort';

const modes: { key: Mode; label: string }[] = [
	{ key: 'default',           label: 'Default icons' },
	{ key: 'custom-pagination', label: 'Custom pagination' },
	{ key: 'custom-expander',   label: 'Custom expander' },
	{ key: 'custom-sort',       label: 'Custom sort' },
];

const ExpandedRow = ({ data: row }: { data: Employee }) => (
	<div style={{ padding: '12px 24px', background: '#f9fafb', fontSize: 13, color: '#4b5563' }}>
		<strong>{row.name}</strong> — {row.bio}
	</div>
);

export default function IconsDemo() {
	const [mode, setMode] = useState<Mode>('default');

	const btnBase = 'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer';
	const btnOn   = 'bg-brand-600 text-white border-brand-600';
	const btnOff  = 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';

	const showExpander = mode === 'custom-expander' || mode === 'default';

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				{modes.map(m => (
					<button key={m.key} className={`${btnBase} ${mode === m.key ? btnOn : btnOff}`} onClick={() => setMode(m.key)}>
						{m.label}
					</button>
				))}
			</div>

			<DataTable
				columns={columns}
				data={data}
				pagination
				paginationPerPage={5}
				highlightOnHover

				// Pagination icons
				{...(mode === 'custom-pagination' ? {
					paginationIconFirstPage:  <ChevronsLeft />,
					paginationIconLastPage:   <ChevronsRight />,
					paginationIconPrevious:   <ChevronLeft />,
					paginationIconNext:       <ChevronRight />,
				} : {})}

				// Sort icon
				{...(mode === 'custom-sort' ? {
					sortIcon: <ArrowUp />,
				} : {})}

				// Expandable rows
				expandableRows={showExpander}
				expandableRowsComponent={ExpandedRow}
				{...(mode === 'custom-expander' ? {
					expandableIcon: {
						collapsed: <ChevronRightSmall />,
						expanded:  <ChevronDown />,
					},
				} : {})}
			/>

			{mode === 'custom-pagination' && (
				<p className="text-xs text-gray-400">Pagination icons replaced with inline SVG chevrons.</p>
			)}
			{mode === 'custom-expander' && (
				<p className="text-xs text-gray-400">Expander icons replaced with inline SVG chevrons.</p>
			)}
			{mode === 'custom-sort' && (
				<p className="text-xs text-gray-400">Sort icon replaced with an up-arrow. Click a sortable column header to see it.</p>
			)}
		</div>
	);
}
