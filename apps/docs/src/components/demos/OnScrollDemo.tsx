import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

const data: Employee[] = Array.from({ length: 40 }, (_, i) => ({
	id: i + 1,
	name:
		[
			'Aria Chen',
			'Marcus Webb',
			'Priya Kapoor',
			'Jordan Ellis',
			'Sam Rivera',
			'Taylor Brooks',
			'Casey Morgan',
			'Alex Kim',
			'Morgan Lee',
			'Drew Park',
		][i % 10] + (i >= 10 ? ` ${Math.floor(i / 10) + 1}` : ''),
	department: ['Engineering', 'Product', 'Design', 'Analytics', 'Sales', 'HR'][i % 6],
	salary: 80000 + ((i * 1237) % 70000),
	status: ['Active', 'Remote', 'On Leave', 'Contractor'][i % 4],
}));

const columns: TableColumn<Employee>[] = [
	{ name: '#', selector: r => r.id, width: '60px' },
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
		sortable: true,
	},
	{ name: 'Status', selector: r => r.status },
];

export default function OnScrollDemo() {
	const [scrollTop, setScrollTop] = useState(0);

	return (
		<div className="space-y-3">
			<div className="text-sm text-gray-500">
				scrollTop: <span className="font-mono font-medium text-gray-800">{scrollTop}px</span>
			</div>

			<DataTable
				columns={columns}
				data={data}
				fixedHeader
				fixedHeaderScrollHeight="300px"
				highlightOnHover
				striped
				onScroll={e => setScrollTop(Math.round((e.target as HTMLDivElement).scrollTop))}
			/>
		</div>
	);
}
