import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type ContextMenuAction, type TableColumn } from 'react-data-table-component';

interface Task {
	id: number;
	title: string;
	assignee: string;
	status: 'Todo' | 'In Progress' | 'Done';
}

const initialData: Task[] = [
	{ id: 1, title: 'Design onboarding flow', assignee: 'Aria Chen', status: 'In Progress' },
	{ id: 2, title: 'Fix pagination bug', assignee: 'Marcus Webb', status: 'Todo' },
	{ id: 3, title: 'Write release notes', assignee: 'Priya Kapoor', status: 'Done' },
	{ id: 4, title: 'Audit dependencies', assignee: 'Jordan Ellis', status: 'Todo' },
];

const columns: TableColumn<Task>[] = [
	{ id: 'title', name: 'Task', selector: row => row.title, grow: 2 },
	{ id: 'assignee', name: 'Assignee', selector: row => row.assignee },
	{ id: 'status', name: 'Status', selector: row => row.status, width: '140px' },
];

export default function RowContextMenuDemo(): JSX.Element {
	const [rows, setRows] = useState<Task[]>(initialData);
	const [lastAction, setLastAction] = useState('none yet — open the ⋮ menu on any row');
	const [menuPosition, setMenuPosition] = useState<'start' | 'end'>('end');

	// Row menu items are a function of the row, so they can vary per row —
	// here "Mark done" disables itself once a task is already Done.
	const rowActions = (row: Task): ContextMenuAction[] => [
		{ id: 'mark-done', label: 'Mark done', disabled: row.status === 'Done' },
		{ id: 'duplicate', label: 'Duplicate' },
		{ id: 'delete', label: 'Delete' },
	];

	const handleAction = (actionId: string, row: Task) => {
		if (actionId === 'mark-done') {
			setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status: 'Done' } : r)));
		} else if (actionId === 'duplicate') {
			setRows(prev => {
				const nextId = Math.max(...prev.map(r => r.id)) + 1;
				const idx = prev.findIndex(r => r.id === row.id);
				const copy: Task = { ...row, id: nextId, title: `${row.title} (copy)` };
				return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
			});
		} else if (actionId === 'delete') {
			setRows(prev => prev.filter(r => r.id !== row.id));
		}
	};

	return (
		<div>
			<label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 12 }}>
				Menu button position
				<select
					value={menuPosition}
					onChange={e => setMenuPosition(e.target.value as 'start' | 'end')}
					style={{ padding: '2px 6px' }}
				>
					<option value="end">end (default)</option>
					<option value="start">start</option>
				</select>
			</label>
			<DataTable
				columns={columns}
				data={rows}
				contextMenu={{ trigger: 'both', menuPosition }}
				contextMenuActions={{ row: rowActions }}
				onContextMenuAction={(action, ctx) => {
					if (ctx.type !== 'row') return;
					handleAction(action.id, ctx.row);
					setLastAction(`${action.id} on "${ctx.row.title}"`);
				}}
				highlightOnHover
			/>
			<p style={{ fontSize: 13, marginTop: 12 }}>
				Last action: <strong>{lastAction}</strong> · Right-click a row or use its ⋮ button.
			</p>
		</div>
	);
}
