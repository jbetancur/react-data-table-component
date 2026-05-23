import React, { useRef, useState } from 'react';
import DataTable, { type DataTableHandle, type TableColumn } from 'react-data-table-component';

type Status = 'pending' | 'approved' | 'rejected' | 'needs-info';

interface Request {
	id: number;
	title: string;
	requester: string;
	department: string;
	amount: number;
	status: Status;
	submittedAt: string;
}

const STATUS_LABEL: Record<Status, string> = {
	'pending':    'Pending',
	'approved':   'Approved',
	'rejected':   'Rejected',
	'needs-info': 'Needs info',
};

const STATUS_CLASS: Record<Status, string> = {
	'pending':    'bg-yellow-50 text-yellow-700 border border-yellow-200',
	'approved':   'bg-green-50 text-green-700 border border-green-200',
	'rejected':   'bg-red-50 text-red-700 border border-red-200',
	'needs-info': 'bg-blue-50 text-blue-700 border border-blue-200',
};

const initialData: Request[] = [
	{ id: 1, title: 'New MacBook Pro',       requester: 'Sam Rivera',    department: 'Engineering', amount: 2499, status: 'pending',    submittedAt: '2024-05-14' },
	{ id: 2, title: 'Figma Teams plan',      requester: 'Priya Kapoor',  department: 'Design',      amount: 720,  status: 'pending',    submittedAt: '2024-05-14' },
	{ id: 3, title: 'AWS reserved instance', requester: 'Aria Chen',     department: 'Engineering', amount: 8400, status: 'needs-info', submittedAt: '2024-05-13' },
	{ id: 4, title: 'Office chairs (x4)',    requester: 'Marcus Webb',   department: 'Product',     amount: 1200, status: 'pending',    submittedAt: '2024-05-12' },
	{ id: 5, title: 'Tableau license',       requester: 'Jordan Ellis',  department: 'Analytics',   amount: 1800, status: 'approved',   submittedAt: '2024-05-10' },
	{ id: 6, title: 'Conference travel',     requester: 'Taylor Brooks', department: 'Sales',       amount: 950,  status: 'rejected',   submittedAt: '2024-05-09' },
	{ id: 7, title: 'Slack Enterprise',      requester: 'Casey Morgan',  department: 'Engineering', amount: 3600, status: 'pending',    submittedAt: '2024-05-08' },
];

const ACTIONABLE: Status[] = ['pending', 'needs-info'];

export default function ApprovalWorkflowDemo() {
	const ref = useRef<DataTableHandle>(null);
	const [data, setData] = useState(initialData);
	const [selected, setSelected] = useState<Request[]>([]);
	const [toast, setToast] = useState('');

	function showToast(msg: string) {
		setToast(msg);
		setTimeout(() => setToast(''), 2500);
	}

	function applyStatus(ids: number[], next: Status) {
		setData(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: next } : r));
		ref.current?.clearSelectedRows();
		showToast(`${ids.length} request${ids.length !== 1 ? 's' : ''} marked as "${STATUS_LABEL[next]}"`);
	}

	const actionable = selected.filter(r => ACTIONABLE.includes(r.status));
	const selectedIds = actionable.map(r => r.id);

	const columns: TableColumn<Request>[] = [
		{ id: 'title',      name: 'Request',    selector: r => r.title,      grow: 2 },
		{ id: 'requester',  name: 'Requester',  selector: r => r.requester,  sortable: true },
		{ id: 'department', name: 'Dept',       selector: r => r.department, sortable: true, width: '120px' },
		{
			id: 'amount',
			name: 'Amount',
			selector: r => r.amount,
			sortable: true,
			right: true,
			width: '110px',
			format: r => `$${r.amount.toLocaleString()}`,
		},
		{
			id: 'status',
			name: 'Status',
			selector: r => r.status,
			sortable: true,
			width: '130px',
			cell: r => (
				<span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CLASS[r.status]}`}>
					{STATUS_LABEL[r.status]}
				</span>
			),
		},
		{ id: 'submittedAt', name: 'Submitted', selector: r => r.submittedAt, sortable: true, width: '115px' },
	];

	return (
		<div className="relative space-y-2">
			{/* Bulk toolbar — actions change based on what's selected */}
			{selected.length > 0 && (
				<div className="flex items-center gap-3 px-4 py-2.5 bg-brand-50 border border-brand-100 rounded-lg text-sm">
					<span className="font-medium text-brand-700">
						{selected.length} selected
						{actionable.length < selected.length && (
							<span className="ml-1 font-normal text-brand-500">
								({selected.length - actionable.length} already resolved, excluded)
							</span>
						)}
					</span>
					<div className="flex gap-2 ml-auto">
						{actionable.length > 0 && (
							<>
								<button
									onClick={() => applyStatus(selectedIds, 'approved')}
									className="px-3 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 text-xs font-medium"
								>
									Approve {actionable.length > 1 ? `(${actionable.length})` : ''}
								</button>
								<button
									onClick={() => applyStatus(selectedIds, 'needs-info')}
									className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-medium"
								>
									Needs info
								</button>
								<button
									onClick={() => applyStatus(selectedIds, 'rejected')}
									className="px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-medium"
								>
									Reject
								</button>
							</>
						)}
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
					selectableRowDisabled={r => !ACTIONABLE.includes(r.status)}
					onSelectedRowsChange={({ selectedRows }) => setSelected(selectedRows)}
					highlightOnHover
					defaultSortFieldId="submittedAt"
					defaultSortAsc={false}
				/>
			</div>

			{toast && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
					{toast}
				</div>
			)}
		</div>
	);
}
