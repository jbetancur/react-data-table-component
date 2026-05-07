import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

// 30 rows so pagination is meaningful
const ALL_DATA: Row[] = Array.from({ length: 30 }, (_, i) => ({
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
	salary: 80000 + i * 3700,
	status: ['Active', 'Remote', 'On Leave', 'Contractor'][i % 4],
}));

const statusColor: Record<string, string> = {
	Active: 'bg-green-100 text-green-700',
	Remote: 'bg-blue-100 text-blue-700',
	'On Leave': 'bg-yellow-100 text-yellow-700',
	Contractor: 'bg-purple-100 text-purple-700',
};

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{
		name: 'Salary',
		selector: r => r.salary,
		sortable: true,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
	},
	{
		name: 'Status',
		selector: r => r.status,
		cell: r => (
			<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
		),
	},
];

export default function PaginationDemo() {
	const [perPage, setPerPage] = useState(5);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3 text-sm">
				<span className="text-gray-500">Rows per page:</span>
				{[5, 10, 15].map(n => (
					<button
						key={n}
						onClick={() => setPerPage(n)}
						className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
							perPage === n
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{n}
					</button>
				))}
				<span className="ml-auto text-gray-400 text-xs">{ALL_DATA.length} total rows</span>
			</div>
			<DataTable
				key={perPage}
				columns={columns}
				data={ALL_DATA}
				pagination
				paginationPerPage={perPage}
				paginationRowsPerPageOptions={[5, 10, 15, 30]}
				highlightOnHover
				striped
				columnSeparator
			/>
		</div>
	);
}
