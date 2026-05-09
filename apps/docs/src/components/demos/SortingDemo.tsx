import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
	hired: string;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, hired: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, hired: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, hired: '2021-01-15' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
];

export default function SortingDemo() {
	const [defaultSort, setDefaultSort] = useState<keyof Row>('name');

	const columns: TableColumn<Row>[] = [
		{ name: 'Name', selector: r => r.name, sortable: true, id: 'name' },
		{ name: 'Department', selector: r => r.department, sortable: true, id: 'department' },
		{
			name: 'Salary',
			selector: r => r.salary,
			sortable: true,
			id: 'salary',
			format: r => `$${r.salary.toLocaleString()}`,
			right: true,
		},
		{ name: 'Hired', selector: r => r.hired, sortable: true, id: 'hired' },
	];

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3 text-sm">
				<span className="text-gray-500">Default sort:</span>
				{(['name', 'salary', 'hired'] as const).map(col => (
					<button
						key={col}
						onClick={() => setDefaultSort(col)}
						className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
							defaultSort === col
								? 'bg-brand-600 text-white border-brand-600'
								: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
						}`}
					>
						{col}
					</button>
				))}
			</div>
			<DataTable
				key={defaultSort}
				columns={columns}
				data={data}
				defaultSortFieldId={defaultSort}
				highlightOnHover
			/>
		</div>
	);
}
