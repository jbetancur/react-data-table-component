import React from 'react';
import DataTable, { type TableColumn, useColumnVisibility } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
	salary: number;
	location: string;
}

const data: Employee[] = [
	{
		id: 1,
		name: 'Aria Chen',
		department: 'Engineering',
		role: 'Engineering Lead',
		salary: 155000,
		location: 'San Francisco',
	},
	{ id: 2, name: 'Marcus Webb', department: 'Product', role: 'Product Manager', salary: 132000, location: 'New York' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', role: 'Senior Designer', salary: 118000, location: 'Austin' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', role: 'Data Scientist', salary: 141000, location: 'Seattle' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', role: 'DevOps Engineer', salary: 128000, location: 'Remote' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', role: 'Account Manager', salary: 98000, location: 'Chicago' },
];

const initialColumns: TableColumn<Employee>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'department', name: 'Department', selector: r => r.department, sortable: true },
	{ id: 'role', name: 'Role', selector: r => r.role },
	{ id: 'salary', name: 'Salary', selector: r => `$${r.salary.toLocaleString()}`, sortable: true },
	{ id: 'location', name: 'Location', selector: r => r.location },
];

export default function ColumnVisibilityDemo() {
	const { columns, entries, toggleColumn, showAll } = useColumnVisibility(initialColumns);
	const [open, setOpen] = React.useState(false);
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, position: 'relative' }} ref={ref}>
				<button
					onClick={() => setOpen(o => !o)}
					style={{
						fontSize: 13,
						padding: '4px 12px',
						borderRadius: 6,
						border: '1px solid #e2e8f0',
						background: 'white',
						cursor: 'pointer',
					}}
				>
					Columns ▾
				</button>
				{open && (
					<div
						style={{
							position: 'absolute',
							top: '100%',
							right: 0,
							marginTop: 4,
							zIndex: 10,
							background: 'white',
							border: '1px solid #e2e8f0',
							borderRadius: 8,
							boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
							padding: '8px 0',
							minWidth: 160,
						}}
					>
						{entries.map(({ column, visible }) => (
							<label
								key={column.id}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									padding: '5px 14px',
									cursor: 'pointer',
									fontSize: 13,
								}}
							>
								<input type="checkbox" checked={visible} onChange={() => toggleColumn(column.id as string | number)} />
								{String(column.name)}
							</label>
						))}
						<div style={{ borderTop: '1px solid #f1f5f9', margin: '6px 0' }} />
						<button
							onClick={showAll}
							style={{
								width: '100%',
								textAlign: 'left',
								padding: '5px 14px',
								fontSize: 13,
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								color: '#6366f1',
							}}
						>
							Show all
						</button>
					</div>
				)}
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
