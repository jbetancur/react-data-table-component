import React, { useState, useMemo, useCallback } from 'react';
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	hired: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, hired: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, hired: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, hired: '2021-01-15' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', salary: 162000, hired: '2017-09-05' },
	{ id: 8, name: 'Casey Park', department: 'Design', salary: 109000, hired: '2022-11-19' },
	// Accented name: default JS sort puts "É" after "Z"; localeCompare puts it near "E"
	{ id: 9, name: 'Étienne Fontaine', department: 'Sales', salary: 108000, hired: '2023-06-01' },
];

type SortFieldId = 'name' | 'department' | 'salary' | 'hired';

const SORT_FIELDS: SortFieldId[] = ['name', 'department', 'salary', 'hired'];

// Down-arrow: default = descending, CSS rotates 180° for ascending (.rdt_sortIconAsc)
const customSortIcon = (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M6 2v7M3.5 7l2.5 2 2.5-2" />
	</svg>
);

export default function SortingDemo() {
	const [defaultSortField, setDefaultSortField] = useState<SortFieldId>('name');
	const [defaultSortAsc, setDefaultSortAsc] = useState(true);
	const [useCustomIcon, setUseCustomIcon] = useState(false);
	const [useCustomFn, setUseCustomFn] = useState(false);
	const [lastSort, setLastSort] = useState<{ column: string; direction: SortOrder } | null>(null);

	const columns = useMemo(
		(): TableColumn<Employee>[] => [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				sortable: true,
				sortFunction: useCustomFn
					? (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
					: undefined,
			},
			{
				id: 'department',
				name: 'Department',
				selector: r => r.department,
				sortable: true,
			},
			{
				id: 'salary',
				name: 'Salary',
				selector: r => r.salary,
				format: r => `$${r.salary.toLocaleString()}`,
				right: true,
				sortable: true,
				sortFunction: useCustomFn ? (a, b) => a.salary - b.salary : undefined,
			},
			{
				id: 'hired',
				name: 'Hired',
				selector: r => r.hired,
				sortable: true,
			},
			{
				id: 'id',
				name: 'ID',
				selector: r => r.id,
			},
		],
		[useCustomFn],
	);

	const handleSort = useCallback((col: TableColumn<Employee>, direction: SortOrder) => {
		setLastSort({ column: String(col.id ?? col.name), direction });
	}, []);

	return (
		<div className="space-y-4">
			{/* Controls */}
			<div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
				<div className="flex items-center gap-2">
					<span className="text-gray-500 shrink-0">Default column:</span>
					<div className="flex gap-1">
						{SORT_FIELDS.map(f => (
							<button
								key={f}
								type="button"
								onClick={() => setDefaultSortField(f)}
								className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
									defaultSortField === f
										? 'bg-brand-600 text-white border-brand-600'
										: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
								}`}
							>
								{f}
							</button>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-gray-500 shrink-0">Default direction:</span>
					{(['asc', 'desc'] as const).map(d => (
						<button
							key={d}
							type="button"
							onClick={() => setDefaultSortAsc(d === 'asc')}
							className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
								(d === 'asc') === defaultSortAsc
									? 'bg-brand-600 text-white border-brand-600'
									: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
							}`}
						>
							{d.toUpperCase()}
						</button>
					))}
				</div>

				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={useCustomIcon}
						onChange={e => setUseCustomIcon(e.target.checked)}
						className="rounded"
					/>
					<span className="text-gray-600 text-xs">Custom sort icon</span>
				</label>

				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={useCustomFn}
						onChange={e => setUseCustomFn(e.target.checked)}
						className="rounded"
					/>
					<span className="text-gray-600 text-xs">
						localeCompare sort <span className="text-gray-400">(sort Name — watch where Étienne lands)</span>
					</span>
				</label>
			</div>

			{/* onSort readout */}
			<div className="text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded px-3 py-2">
				{lastSort
					? `onSort → column: "${lastSort.column}", direction: "${lastSort.direction}"`
					: 'onSort → (click a column header to see the callback fire)'}
			</div>

			<DataTable
				key={`${defaultSortField}-${defaultSortAsc}`}
				columns={columns}
				data={data}
				defaultSortFieldId={defaultSortField}
				defaultSortAsc={defaultSortAsc}
				sortIcon={useCustomIcon ? customSortIcon : undefined}
				onSort={handleSort}
				highlightOnHover
			/>
		</div>
	);
}
