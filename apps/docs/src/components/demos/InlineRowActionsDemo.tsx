import React, { useEffect, useRef, useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
	email: string;
}

const seed: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', role: 'Engineering Lead', email: 'aria@example.com' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', role: 'Product Manager', email: 'marcus@example.com' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', role: 'Senior Designer', email: 'priya@example.com' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', role: 'Data Scientist', email: 'jordan@example.com' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', role: 'DevOps Engineer', email: 'sam@example.com' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', role: 'Account Manager', email: 'taylor@example.com' },
];

type ModalState =
	| { type: 'none' }
	| { type: 'edit'; row: Employee }
	| { type: 'delete'; row: Employee }
	| { type: 'duplicate'; row: Employee };

function DropdownMenu({
	row,
	onEdit,
	onDuplicate,
	onDelete,
}: {
	row: Employee;
	onEdit: (r: Employee) => void;
	onDuplicate: (r: Employee) => void;
	onDelete: (r: Employee) => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function handle(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		}
		document.addEventListener('mousedown', handle);
		return () => document.removeEventListener('mousedown', handle);
	}, [open]);

	return (
		<div className="relative" ref={ref}>
			<button
				onClick={e => {
					e.stopPropagation();
					setOpen(o => !o);
				}}
				className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
				aria-label="Row actions"
			>
				<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<circle cx="8" cy="3" r="1.5" />
					<circle cx="8" cy="8" r="1.5" />
					<circle cx="8" cy="13" r="1.5" />
				</svg>
			</button>
			{open && (
				<div className="absolute right-0 z-20 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
					<button
						onClick={e => {
							e.stopPropagation();
							setOpen(false);
							onEdit(row);
						}}
						className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
					>
						Edit
					</button>
					<button
						onClick={e => {
							e.stopPropagation();
							setOpen(false);
							onDuplicate(row);
						}}
						className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700"
					>
						Duplicate
					</button>
					<div className="border-t border-gray-100 my-1" />
					<button
						onClick={e => {
							e.stopPropagation();
							setOpen(false);
							onDelete(row);
						}}
						className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
					>
						Delete
					</button>
				</div>
			)}
		</div>
	);
}

export default function InlineRowActionsDemo() {
	const [data, setData] = useState(seed);
	const [modal, setModal] = useState<ModalState>({ type: 'none' });
	const [editDraft, setEditDraft] = useState<Employee | null>(null);
	const [toast, setToast] = useState('');
	const nextId = useRef(seed.length + 1);

	function showToast(msg: string) {
		setToast(msg);
		setTimeout(() => setToast(''), 2000);
	}

	function openEdit(row: Employee) {
		setEditDraft({ ...row });
		setModal({ type: 'edit', row });
	}

	function commitEdit() {
		if (!editDraft) return;
		setData(prev => prev.map(r => (r.id === editDraft.id ? editDraft : r)));
		setModal({ type: 'none' });
		showToast(`Saved ${editDraft.name}`);
	}

	function commitDuplicate(row: Employee) {
		const copy = { ...row, id: nextId.current++, name: `${row.name} (copy)` };
		setData(prev => [...prev, copy]);
		setModal({ type: 'none' });
		showToast(`Duplicated ${row.name}`);
	}

	function commitDelete(row: Employee) {
		setData(prev => prev.filter(r => r.id !== row.id));
		setModal({ type: 'none' });
		showToast(`Deleted ${row.name}`);
	}

	const columns: TableColumn<Employee>[] = [
		{ name: 'Name', selector: r => r.name, sortable: true, grow: 1 },
		{ name: 'Department', selector: r => r.department, sortable: true },
		{ name: 'Role', selector: r => r.role, grow: 1 },
		{
			name: '',
			button: true,
			width: '48px',
			cell: row => (
				<DropdownMenu
					row={row}
					onEdit={openEdit}
					onDuplicate={r => setModal({ type: 'duplicate', row: r })}
					onDelete={r => setModal({ type: 'delete', row: r })}
				/>
			),
		},
	];

	return (
		<div className="relative">
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					columns={columns}
					data={data}
					highlightOnHover
					noDataComponent={<div className="py-8 text-sm text-gray-400">No employees</div>}
				/>
			</div>

			{/* Edit modal */}
			{modal.type === 'edit' && editDraft && (
				<div
					className="fixed inset-0 z-30 flex items-center justify-center bg-black/20"
					onClick={() => setModal({ type: 'none' })}
				>
					<div
						className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-80 space-y-4"
						onClick={e => e.stopPropagation()}
					>
						<h3 className="font-semibold text-gray-900">Edit employee</h3>
						{(['name', 'role', 'email'] as const).map(field => (
							<div key={field}>
								<label className="block text-xs text-gray-500 mb-1 capitalize">{field}</label>
								<input
									value={editDraft[field]}
									onChange={e => setEditDraft(d => (d ? { ...d, [field]: e.target.value } : d))}
									className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-brand-400"
								/>
							</div>
						))}
						<div className="flex justify-end gap-2 pt-1">
							<button
								onClick={() => setModal({ type: 'none' })}
								className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={commitEdit}
								className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-md hover:bg-brand-700"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Duplicate confirmation */}
			{modal.type === 'duplicate' && (
				<div
					className="fixed inset-0 z-30 flex items-center justify-center bg-black/20"
					onClick={() => setModal({ type: 'none' })}
				>
					<div
						className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-72 space-y-4"
						onClick={e => e.stopPropagation()}
					>
						<h3 className="font-semibold text-gray-900">Duplicate row?</h3>
						<p className="text-sm text-gray-500">
							A copy of <strong>{modal.row.name}</strong> will be added to the list.
						</p>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setModal({ type: 'none' })}
								className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={() => commitDuplicate(modal.row)}
								className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-md hover:bg-brand-700"
							>
								Duplicate
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete confirmation */}
			{modal.type === 'delete' && (
				<div
					className="fixed inset-0 z-30 flex items-center justify-center bg-black/20"
					onClick={() => setModal({ type: 'none' })}
				>
					<div
						className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-72 space-y-4"
						onClick={e => e.stopPropagation()}
					>
						<h3 className="font-semibold text-gray-900">Delete employee?</h3>
						<p className="text-sm text-gray-500">
							This will permanently remove <strong>{modal.row.name}</strong>.
						</p>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setModal({ type: 'none' })}
								className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={() => commitDelete(modal.row)}
								className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{toast && (
				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-40">
					{toast}
				</div>
			)}
		</div>
	);
}
