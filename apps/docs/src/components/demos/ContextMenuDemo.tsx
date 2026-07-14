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
	startDate: string;
	status: string;
}

const initialData: Row[] = [
	{
		id: 1,
		name: 'Aria Chen',
		role: 'Engineering Lead',
		department: 'Engineering',
		location: 'San Francisco',
		salary: 155000,
		startDate: '2019-03-11',
		status: 'Active',
	},
	{
		id: 2,
		name: 'Marcus Webb',
		role: 'Product Manager',
		department: 'Product',
		location: 'New York',
		salary: 132000,
		startDate: '2021-07-02',
		status: 'Active',
	},
	{
		id: 3,
		name: 'Priya Kapoor',
		role: 'Senior Designer',
		department: 'Design',
		location: 'Austin',
		salary: 118000,
		startDate: '2020-01-20',
		status: 'Active',
	},
	{
		id: 4,
		name: 'Jordan Ellis',
		role: 'Data Scientist',
		department: 'Analytics',
		location: 'Seattle',
		salary: 143000,
		startDate: '2018-10-05',
		status: 'On Leave',
	},
	{
		id: 5,
		name: 'Sam Rivera',
		role: 'DevOps Engineer',
		department: 'Engineering',
		location: 'Remote',
		salary: 128000,
		startDate: '2022-04-14',
		status: 'Active',
	},
];

// Fixed widths so the table overflows horizontally — otherwise pinning a column
// has nothing to stick against and appears to do nothing.
const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: row => row.name, sortable: true, width: '180px', filterable: true },
	{ id: 'role', name: 'Role', selector: row => row.role, sortable: true, width: '220px' },
	{ id: 'department', name: 'Department', selector: row => row.department, sortable: true, width: '180px' },
	{ id: 'location', name: 'Location', selector: row => row.location, sortable: true, width: '200px' },
	{
		id: 'salary',
		name: 'Salary',
		selector: row => row.salary,
		sortable: true,
		right: true,
		width: '140px',
		format: row => `$${row.salary.toLocaleString()}`,
	},
	{ id: 'startDate', name: 'Start Date', selector: row => row.startDate, sortable: true, width: '150px' },
	{ id: 'status', name: 'Status', selector: row => row.status, width: '140px' },
];

export default function ContextMenuDemo(): JSX.Element {
	const [lastAction, setLastAction] = useState('none yet — right-click a header or use a ⋮ button');

	return (
		<div>
			<DataTable
				columns={columns}
				data={initialData}
				contextMenu={{ trigger: 'both' }}
				onContextMenuAction={(action, ctx) => {
					if (ctx.type === 'header') {
						setLastAction(`${action.id} on column "${String(ctx.column.name)}"`);
					}
				}}
				resizable
				highlightOnHover
			/>
			<p style={{ fontSize: 13, marginTop: 12 }}>
				Last action: <strong>{lastAction}</strong> · Right-click a header, or use its ⋮ button, to sort, pin, hide, or
				reset columns.
			</p>
		</div>
	);
}
