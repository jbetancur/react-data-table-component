import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn, type FooterComponentProps } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	bonus: number;
}

const ALL_DATA: Row[] = [
	{ id: 1,  name: 'Aria Chen',      department: 'Engineering', salary: 155000, bonus: 12000 },
	{ id: 2,  name: 'Marcus Webb',    department: 'Product',     salary: 132000, bonus: 9500  },
	{ id: 3,  name: 'Priya Kapoor',   department: 'Design',      salary: 118000, bonus: 7800  },
	{ id: 4,  name: 'Jordan Ellis',   department: 'Analytics',   salary: 143000, bonus: 11200 },
	{ id: 5,  name: 'Sam Rivera',     department: 'Engineering', salary: 128000, bonus: 9000  },
	{ id: 6,  name: 'Taylor Brooks',  department: 'Engineering', salary: 122000, bonus: 8400  },
	{ id: 7,  name: 'Casey Morgan',   department: 'Product',     salary: 108000, bonus: 6600  },
	{ id: 8,  name: 'Alex Kim',       department: 'Analytics',   salary: 137000, bonus: 10100 },
	{ id: 9,  name: 'Morgan Lee',     department: 'Design',      salary: 114000, bonus: 7200  },
	{ id: 10, name: 'Drew Park',      department: 'Engineering', salary: 141000, bonus: 10800 },
];

function SummaryFooter({ rows }: FooterComponentProps<Row>) {
	const totalSalary = rows.reduce((s, r) => s + r.salary, 0);
	const totalBonus  = rows.reduce((s, r) => s + r.bonus, 0);
	const avgSalary   = rows.length ? Math.round(totalSalary / rows.length) : 0;

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '16px 32px',
				padding: '10px 16px',
				borderTop: '1px solid #e5e7eb',
				backgroundColor: '#f8fafc',
				fontSize: 13,
				color: '#374151',
			}}
		>
			<span>
				<strong>{rows.length}</strong> {rows.length === 1 ? 'employee' : 'employees'}
			</span>
			<span>
				Salary total: <strong>${totalSalary.toLocaleString()}</strong>
			</span>
			<span>
				Salary avg: <strong>${avgSalary.toLocaleString()}</strong>
			</span>
			<span>
				Bonus total: <strong>${totalBonus.toLocaleString()}</strong>
			</span>
			<span>
				Total comp: <strong>${(totalSalary + totalBonus).toLocaleString()}</strong>
			</span>
		</div>
	);
}

const columns: TableColumn<Row>[] = [
	{ id: 'name',       name: 'Name',       selector: r => r.name,       sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		right: true,
		format: r => `$${r.salary.toLocaleString()}`,
	},
	{
		id: 'bonus',
		name: 'Bonus',
		selector: r => r.bonus,
		sortable: true,
		right: true,
		format: r => `$${r.bonus.toLocaleString()}`,
	},
];

export default function FooterCustomDemo() {
	const [deptFilter, setDeptFilter] = useState('All');
	const departments = ['All', 'Engineering', 'Product', 'Design', 'Analytics'];
	const data = deptFilter === 'All' ? ALL_DATA : ALL_DATA.filter(r => r.department === deptFilter);

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
			<DataTable
				columns={columns}
				data={data}
				highlightOnHover
				dense
				footerComponent={SummaryFooter}
			/>
		</div>
	);
}
