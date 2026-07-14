import { useMemo, useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	department: string;
	location: string;
	salary: number;
	status: string;
}

const data: Row[] = [
	{
		id: 1,
		name: 'Aria Chen',
		role: 'Engineering Lead',
		department: 'Engineering',
		location: 'San Francisco',
		salary: 155000,
		status: 'Active',
	},
	{
		id: 2,
		name: 'Marcus Webb',
		role: 'Product Manager',
		department: 'Product',
		location: 'New York',
		salary: 132000,
		status: 'Active',
	},
	{
		id: 3,
		name: 'Priya Kapoor',
		role: 'Senior Designer',
		department: 'Design',
		location: 'Austin',
		salary: 118000,
		status: 'Active',
	},
	{
		id: 4,
		name: 'Jordan Ellis',
		role: 'Data Scientist',
		department: 'Analytics',
		location: 'Seattle',
		salary: 143000,
		status: 'On Leave',
	},
	{
		id: 5,
		name: 'Sam Rivera',
		role: 'DevOps Engineer',
		department: 'Engineering',
		location: 'Remote',
		salary: 128000,
		status: 'Active',
	},
	{
		id: 6,
		name: 'Taylor Kim',
		role: 'Frontend Engineer',
		department: 'Engineering',
		location: 'Chicago',
		salary: 122000,
		status: 'Active',
	},
	{
		id: 7,
		name: 'Alex Morgan',
		role: 'QA Engineer',
		department: 'Engineering',
		location: 'Denver',
		salary: 108000,
		status: 'Active',
	},
	{
		id: 8,
		name: 'Casey Nguyen',
		role: 'Scrum Master',
		department: 'Product',
		location: 'Boston',
		salary: 115000,
		status: 'Active',
	},
];

const initialColumns: TableColumn<Row>[] = [
	{
		id: 'name',
		name: 'Name',
		selector: r => r.name,
		sortable: true,
		width: '180px',
		minWidth: '120px',
		reorder: true,
	},
	{ id: 'role', name: 'Role', selector: r => r.role, sortable: true, width: '220px', minWidth: '120px', reorder: true },
	{
		id: 'department',
		name: 'Department',
		selector: r => r.department,
		sortable: true,
		width: '180px',
		minWidth: '120px',
		reorder: true,
	},
	{
		id: 'location',
		name: 'Location',
		selector: r => r.location,
		sortable: true,
		width: '200px',
		minWidth: '120px',
		reorder: true,
	},
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		width: '140px',
		minWidth: '100px',
		right: true,
		format: r => `$${r.salary.toLocaleString()}`,
		reorder: true,
	},
	{ id: 'status', name: 'Status', selector: r => r.status, width: '120px', minWidth: '90px', reorder: true },
];

function PinPicker({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: number;
	options: string[];
	onChange: (n: number) => void;
}) {
	const btn = (active: boolean) =>
		`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
			active
				? 'bg-brand-600 text-white border-brand-600'
				: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
		}`;
	return (
		<div className="flex items-center gap-2">
			<span className="text-gray-500 shrink-0">{label}:</span>
			<div className="flex gap-1">
				<button type="button" onClick={() => onChange(0)} className={btn(value === 0)}>
					none
				</button>
				{options.map((name, n) => (
					<button key={name} type="button" onClick={() => onChange(n + 1)} className={btn(n < value)}>
						{name}
					</button>
				))}
			</div>
		</div>
	);
}

export default function ColumnPinningDemo() {
	const [columns, setColumns] = useState(initialColumns);
	const [leftPins, setLeftPins] = useState(1);
	const [rightPins, setRightPins] = useState(1);

	const effectiveColumns = useMemo(
		() =>
			columns.map((col, i) => ({
				...col,
				pinned: i < leftPins ? ('left' as const) : i >= columns.length - rightPins ? ('right' as const) : undefined,
			})),
		[columns, leftPins, rightPins],
	);

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
				<PinPicker
					label="Pin left"
					value={leftPins}
					options={columns.slice(0, 3).map(c => String(c.name))}
					onChange={setLeftPins}
				/>
				<PinPicker
					label="Pin right"
					value={rightPins}
					options={[String(columns[columns.length - 1].name)]}
					onChange={setRightPins}
				/>
			</div>
			<p className="text-xs text-gray-400">
				Pinning is cumulative from the edge: picking the third column pins the first three. Drag unpinned headers to
				reorder, resize any column from its right edge, and scroll horizontally to see pinned columns hold their
				position.
			</p>
			<DataTable columns={effectiveColumns} data={data} resizable onColumnOrderChange={setColumns} highlightOnHover />
		</div>
	);
}
