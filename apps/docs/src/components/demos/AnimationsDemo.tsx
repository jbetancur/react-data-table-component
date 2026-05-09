import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const BASE_DATA: Row[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000 },
];

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
];

export default function AnimationsDemo() {
	const [animate, setAnimate] = useState(true);
	const [mountKey, setMountKey] = useState(0);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-4 flex-wrap text-sm">
				<label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
					<input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} className="rounded" />
					animateRows
				</label>
				<button
					onClick={() => setMountKey(k => k + 1)}
					className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
				>
					Replay entrance animation
				</button>
				<span className="text-gray-400 text-xs ml-auto">
					{animate ? 'Animations on — sort to see reorder animation' : 'Animations off'}
				</span>
			</div>
			<DataTable
				key={mountKey}
				columns={columns}
				data={BASE_DATA}
				animateRows={animate}
				highlightOnHover
			/>
		</div>
	);
}
