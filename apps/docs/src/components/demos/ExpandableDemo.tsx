import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	role: string;
	department: string;
	salary: number;
	bio: string;
}

const data: Row[] = [
	{
		id: 1,
		name: 'Aria Chen',
		role: 'Engineering Lead',
		department: 'Engineering',
		salary: 155000,
		bio: 'Aria leads the platform team, focusing on reliability and developer experience. She joined in 2019 after 4 years at a fintech startup.',
	},
	{
		id: 2,
		name: 'Marcus Webb',
		role: 'Product Manager',
		department: 'Product',
		salary: 132000,
		bio: 'Marcus drives roadmap strategy across three product lines. Previously at a Series B SaaS company as a senior PM.',
	},
	{
		id: 3,
		name: 'Priya Kapoor',
		role: 'Senior Designer',
		department: 'Design',
		salary: 118000,
		bio: 'Priya leads the design system and owns the mobile experience. She holds an MFA in interaction design.',
	},
	{
		id: 4,
		name: 'Jordan Ellis',
		role: 'Data Scientist',
		department: 'Analytics',
		salary: 143000,
		bio: 'Jordan builds ML pipelines for churn prediction and revenue forecasting. PhD in applied mathematics.',
	},
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Role', selector: r => r.role },
	{ name: 'Department', selector: r => r.department },
	{ name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}`, right: true },
];

const ExpandedRow = ({ data: row }: { data: Row }) => (
	<div className="px-10 py-4 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
		<p className="font-medium text-gray-700 mb-1">{row.name}</p>
		<p>{row.bio}</p>
	</div>
);

export default function ExpandableDemo() {
	const [animate, setAnimate] = useState(true);

	return (
		<div className="space-y-3">
			<label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer select-none">
				<input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} className="rounded" />
				Animate expand
			</label>
			<DataTable
				columns={columns}
				data={data}
				expandableRows
				expandableRowsComponent={ExpandedRow}
				highlightOnHover
				columnSeparator
				animateRows={animate}
			/>
		</div>
	);
}
