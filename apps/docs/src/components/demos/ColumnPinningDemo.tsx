import { useState } from 'react';
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
		pinned: 'left',
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
	{ id: 'status', name: 'Status', selector: r => r.status, width: '120px', minWidth: '90px', pinned: 'right', reorder: true },
];

export default function ColumnPinningDemo() {
	const [columns, setColumns] = useState(initialColumns);

	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				<strong>Name</strong> is pinned left, <strong>Status</strong> is pinned right. Drag middle column headers to
				reorder, resize any column from its right edge.
			</p>
			<DataTable columns={columns} data={data} resizable onColumnOrderChange={setColumns} highlightOnHover />
		</div>
	);
}
