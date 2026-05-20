import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: 'Active' | 'Remote' | 'Contractor' | 'On Leave';
}

const data: Employee[] = Array.from({ length: 20 }, (_, i) => ({
	id: i + 1,
	name: ['Aria Chen', 'Marcus Webb', 'Priya Kapoor', 'Jordan Ellis', 'Sam Rivera', 'Taylor Brooks', 'Casey Morgan', 'Alex Kim', 'Morgan Lee', 'Drew Park'][i % 10] + (i >= 10 ? ` ${Math.floor(i / 10) + 1}` : ''),
	department: ['Engineering', 'Product', 'Design', 'Analytics', 'Sales', 'HR'][i % 6],
	salary: 80000 + i * 4200,
	status: (['Active', 'Remote', 'Contractor', 'On Leave'] as const)[i % 4],
}));

const statusColors: Record<Employee['status'], string> = {
	Active: 'bg-green-100 text-green-700',
	Remote: 'bg-blue-100 text-blue-700',
	Contractor: 'bg-yellow-100 text-yellow-700',
	'On Leave': 'bg-gray-100 text-gray-600',
};

export default function MobileDemo() {
	const [width, setWidth] = useState<'375' | '430' | '100%'>('375');
	const [variant, setVariant] = useState<'basic' | 'selection' | 'pagination'>('basic');

	const isNarrow = width === '375' || width === '430';

	const baseColumns: TableColumn<Employee>[] = [
		{
			name: 'Name',
			selector: r => r.name,
			sortable: true,
			grow: 1.5,
		},
		{
			name: 'Dept',
			selector: r => r.department,
			sortable: true,
			omit: isNarrow,
		},
		{
			name: 'Salary',
			selector: r => r.salary,
			sortable: true,
			right: true,
			format: r => `$${r.salary.toLocaleString()}`,
			omit: isNarrow,
		},
		{
			name: 'Status',
			selector: r => r.status,
			center: true,
			cell: r => (
				<span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
					{r.status}
				</span>
			),
		},
	];

	const btnBase = 'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer';
	const btnOn = 'bg-brand-600 text-white border-brand-600';
	const btnOff = 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-3 items-center">
				<div className="flex items-center gap-1.5">
					<span className="text-xs text-gray-500">Viewport:</span>
					{(['375', '430', '100%'] as const).map(w => (
						<button key={w} className={`${btnBase} ${width === w ? btnOn : btnOff}`} onClick={() => setWidth(w)}>
							{w === '100%' ? 'Full' : `${w}px`}
						</button>
					))}
				</div>
				<div className="flex items-center gap-1.5">
					<span className="text-xs text-gray-500">Mode:</span>
					{(['basic', 'selection', 'pagination'] as const).map(v => (
						<button key={v} className={`${btnBase} ${variant === v ? btnOn : btnOff}`} onClick={() => setVariant(v)}>
							{v}
						</button>
					))}
				</div>
			</div>

			<div
				className="border border-dashed border-gray-300 rounded-lg overflow-hidden bg-white mx-auto transition-all"
				style={{ width: width === '100%' ? '100%' : `${width}px`, maxWidth: '100%' }}
			>
				{width !== '100%' && (
					<div className="bg-gray-100 px-3 py-1.5 flex items-center justify-between border-b border-gray-200">
						<span className="text-xs text-gray-400 font-mono">{width}px viewport</span>
						<div className="flex gap-1">
							<div className="w-2 h-2 rounded-full bg-red-400" />
							<div className="w-2 h-2 rounded-full bg-yellow-400" />
							<div className="w-2 h-2 rounded-full bg-green-400" />
						</div>
					</div>
				)}
				<DataTable
					columns={baseColumns}
					data={data}
					title={variant === 'basic' ? 'Team' : undefined}
					selectableRows={variant === 'selection'}
					pagination={variant === 'pagination'}
					paginationPerPage={5}
					paginationRowsPerPageOptions={[5, 10]}
					highlightOnHover
					striped
					dense={width === '375'}
				/>
			</div>

			{isNarrow && (
				<p className="text-xs text-gray-400 text-center">
					Department and Salary are hidden at this width — use <code className="bg-gray-100 px-1 rounded">omit</code> or <code className="bg-gray-100 px-1 rounded">hide: &quot;sm&quot;</code> to drop columns on small screens.
				</p>
			)}
		</div>
	);
}
