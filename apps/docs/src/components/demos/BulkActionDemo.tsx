import React, { useRef, useState } from 'react';
import DataTable, { type DataTableHandle, type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', role: 'Engineering Lead' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', role: 'Product Manager' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', role: 'Senior Designer' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', role: 'Data Scientist' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', role: 'DevOps Engineer' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', role: 'Account Manager' },
];

const columns: TableColumn<Employee>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{ name: 'Role', selector: r => r.role },
];

export default function BulkActionDemo() {
	const ref = useRef<DataTableHandle>(null);
	const [selected, setSelected] = useState<Employee[]>([]);
	const [toast, setToast] = useState('');

	function showToast(msg: string) {
		setToast(msg);
		setTimeout(() => setToast(''), 2500);
	}

	function handleExport() {
		showToast(`Exported ${selected.length} row${selected.length !== 1 ? 's' : ''}`);
		ref.current?.clearSelectedRows();
	}

	function handleArchive() {
		showToast(`Archived: ${selected.map(r => r.name).join(', ')}`);
		ref.current?.clearSelectedRows();
	}

	return (
		<div className="relative">
			{/* Toolbar */}
			{selected.length > 0 && (
				<div className="flex items-center gap-3 px-4 py-2.5 mb-2 bg-brand-50 border border-brand-100 rounded-lg text-sm">
					<span className="font-medium text-brand-700">{selected.length} selected</span>
					<div className="flex gap-2 ml-auto">
						<button
							onClick={handleExport}
							className="px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:border-gray-300 text-xs font-medium"
						>
							Export
						</button>
						<button
							onClick={handleArchive}
							className="px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-medium"
						>
							Archive
						</button>
						<button
							onClick={() => ref.current?.clearSelectedRows()}
							className="px-3 py-1 rounded-md text-gray-400 hover:text-gray-600 text-xs"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					ref={ref}
					columns={columns}
					data={data}
					keyField="id"
					selectableRows
					highlightOnHover
					onSelectedRowsChange={({ selectedRows }) => setSelected(selectedRows)}
					pagination
					paginationPerPage={5}
				/>
			</div>

			{/* Toast */}
			{toast && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg">
					{toast}
				</div>
			)}
		</div>
	);
}
