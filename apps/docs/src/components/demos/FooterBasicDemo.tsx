import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	bonus: number;
}

const ALL_DATA: Row[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, bonus: 12000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, bonus: 9500 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, bonus: 7800 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, bonus: 11200 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, bonus: 9000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Engineering', salary: 122000, bonus: 8400 },
	{ id: 7, name: 'Casey Morgan', department: 'Product', salary: 108000, bonus: 6600 },
	{ id: 8, name: 'Alex Kim', department: 'Analytics', salary: 137000, bonus: 10100 },
	{ id: 9, name: 'Morgan Lee', department: 'Design', salary: 114000, bonus: 7200 },
	{ id: 10, name: 'Drew Park', department: 'Engineering', salary: 141000, bonus: 10800 },
];

export default function FooterBasicDemo() {
	const [deptFilter, setDeptFilter] = useState('All');
	const departments = ['All', 'Engineering', 'Product', 'Design', 'Analytics'];
	const data = deptFilter === 'All' ? ALL_DATA : ALL_DATA.filter(r => r.department === deptFilter);

	const columns: TableColumn<Row>[] = [
		{
			id: 'name',
			name: 'Name',
			selector: r => r.name,
			sortable: true,
			footer: rows => `${rows.length} employee${rows.length !== 1 ? 's' : ''}`,
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
			sortable: true,
			right: true,
			format: r => `$${r.salary.toLocaleString()}`,
			footer: rows => `$${rows.reduce((s, r) => s + r.salary, 0).toLocaleString()}`,
		},
		{
			id: 'bonus',
			name: 'Bonus',
			selector: r => r.bonus,
			sortable: true,
			right: true,
			format: r => `$${r.bonus.toLocaleString()}`,
			footer: rows => `$${rows.reduce((s, r) => s + r.bonus, 0).toLocaleString()}`,
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
				<span style={{ fontSize: 13, color: '#6b7280' }}>Filter by department:</span>
				{departments.map(d => (
					<button
						key={d}
						onClick={() => setDeptFilter(d)}
						style={{
							fontSize: 12,
							padding: '3px 10px',
							borderRadius: 9999,
							border: '1px solid',
							cursor: 'pointer',
							borderColor: deptFilter === d ? '#6366f1' : '#d1d5db',
							backgroundColor: deptFilter === d ? '#6366f1' : 'transparent',
							color: deptFilter === d ? '#fff' : '#374151',
						}}
					>
						{d}
					</button>
				))}
			</div>
			<DataTable columns={columns} data={data} highlightOnHover />
		</div>
	);
}
