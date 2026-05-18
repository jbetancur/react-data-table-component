import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

const ALL_DATA: Row[] = Array.from({ length: 20 }, (_, i) => ({
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
	{ name: 'Status', selector: r => r.status },
];

type Position = 'top' | 'bottom' | 'both';

export default function PaginationPositionDemo() {
	const [position, setPosition] = useState<Position>('bottom');

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-500">Position:</span>
				{(['top', 'bottom', 'both'] as Position[]).map(p => (
					<button
						key={p}
						onClick={() => setPosition(p)}
						className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
							position === p
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{p}
					</button>
				))}
			</div>
			<DataTable
				columns={columns}
				data={ALL_DATA}
				pagination
				paginationPosition={position}
				paginationPerPage={5}
				paginationRowsPerPageOptions={[5, 10, 20]}
				highlightOnHover
				striped
			/>
		</div>
	);
}
