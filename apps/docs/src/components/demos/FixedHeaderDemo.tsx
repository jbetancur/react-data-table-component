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

const HEIGHT_OPTIONS = ['200px', '300px', '400px'];

export default function FixedHeaderDemo() {
	const [fixedHeader, setFixedHeader] = useState(true);
	const [scrollHeight, setScrollHeight] = useState('300px');

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
				<label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-500">
					<input
						type="checkbox"
						checked={fixedHeader}
						onChange={e => setFixedHeader(e.target.checked)}
						className="rounded"
					/>
					fixedHeader
				</label>

				<div className="flex items-center gap-2">
					<span className="text-gray-500 shrink-0">fixedHeaderScrollHeight:</span>
					<div className="flex gap-1">
						{HEIGHT_OPTIONS.map(h => (
							<button
								key={h}
								type="button"
								onClick={() => setScrollHeight(h)}
								disabled={!fixedHeader}
								className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-40 ${
									scrollHeight === h && fixedHeader
										? 'bg-brand-600 text-white border-brand-600'
										: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
								}`}
							>
								{h}
							</button>
						))}
					</div>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={data}
				fixedHeader={fixedHeader}
				fixedHeaderScrollHeight={scrollHeight}
				highlightOnHover
				striped
			/>
		</div>
	);
}
