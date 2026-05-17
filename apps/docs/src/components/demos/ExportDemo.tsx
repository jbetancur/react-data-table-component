import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { useTableExport, type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen',     department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb',   department: 'Product',     salary: 132000 },
	{ id: 3, name: 'Priya Kapoor',  department: 'Design',      salary: 118000 },
	{ id: 4, name: 'Jordan Ellis',  department: 'Analytics',   salary: 143000 },
	{ id: 5, name: 'Sam Rivera',    department: 'Engineering', salary: 128000 },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales',       salary:  97000 },
];

const columns: TableColumn<Employee>[] = [
	{ id: 'name',       name: 'Name',       selector: r => r.name,       sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{ id: 'salary',     name: 'Salary',     selector: r => r.salary,     right: true,
		format: r => `$${r.salary.toLocaleString()}` },
];

export default function ExportDemo() {
	const [copied, setCopied] = useState(false);
	const { download, copy } = useTableExport({ columns, rows: data, valueSource: 'format' });

	async function handleCopy(format: 'csv' | 'json') {
		await copy(format);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm flex-wrap">
				<button
					onClick={() => download('employees.csv')}
					className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Download CSV
				</button>
				<button
					onClick={() => download('employees.json', 'json')}
					className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					Download JSON
				</button>
				<button
					onClick={() => handleCopy('csv')}
					className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
				>
					{copied ? 'Copied!' : 'Copy CSV'}
				</button>
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
