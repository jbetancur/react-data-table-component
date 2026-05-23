import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	role: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, role: 'Engineering Lead' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, role: 'Product Manager' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, role: 'Senior Designer' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, role: 'Data Scientist' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, role: 'DevOps Engineer' },
];

const STORAGE_KEY = 'recipe-demo-column-widths';

function loadWidths(): Record<string, number> {
	try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
	catch { return {}; }
}

const columnDefs: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{ id: 'role', name: 'Role', selector: r => r.role },
	{ id: 'salary', name: 'Salary', selector: r => r.salary, right: true, format: r => `$${r.salary.toLocaleString()}` },
];

export default function PersistColumnWidthsDemo() {
	const [initialWidths, setInitialWidths] = useState<Record<string, number> | null>(null);
	const [saved, setSaved] = useState(false);

	React.useEffect(() => {
		setInitialWidths(loadWidths());
	}, []);

	function handleResize(_id: string | number, _w: number, all: Record<string | number, number>) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
		setSaved(true);
		setTimeout(() => setSaved(false), 1500);
	}

	function handleReset() {
		localStorage.removeItem(STORAGE_KEY);
		setInitialWidths({});
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3 text-sm text-gray-500">
				<span className="text-xs">Drag column edges to resize — widths persist across sessions.</span>
				<button
					onClick={handleReset}
					className="ml-auto px-2.5 py-1 text-xs border border-gray-200 rounded-md hover:border-gray-300 text-gray-500"
				>
					Reset widths
				</button>
				{saved && <span className="text-xs text-green-600">Saved!</span>}
			</div>
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				{initialWidths !== null && (
					<DataTable
						key={JSON.stringify(initialWidths)}
						columns={columnDefs}
						data={data}
						resizable
						initialColumnWidths={initialWidths}
						onColumnResize={handleResize}
						highlightOnHover
					/>
				)}
			</div>
		</div>
	);
}
