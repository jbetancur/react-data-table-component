import React, { useState } from 'react';
import DataTable, { type TableColumn, type ColumnGroup } from 'react-data-table-component';

interface Row {
	id: number;
	firstName: string;
	lastName: string;
	department: string;
	baseSalary: number;
	bonus: number;
}

const data: Row[] = [
	{ id: 1, firstName: 'Aria', lastName: 'Chen', department: 'Engineering', baseSalary: 140000, bonus: 15000 },
	{ id: 2, firstName: 'Marcus', lastName: 'Webb', department: 'Product', baseSalary: 125000, bonus: 7000 },
	{ id: 3, firstName: 'Priya', lastName: 'Kapoor', department: 'Design', baseSalary: 110000, bonus: 8000 },
	{ id: 4, firstName: 'Jordan', lastName: 'Ellis', department: 'Analytics', baseSalary: 135000, bonus: 12000 },
	{ id: 5, firstName: 'Sam', lastName: 'Rivera', department: 'Engineering', baseSalary: 120000, bonus: 9000 },
];

const initialColumns: TableColumn<Row>[] = [
	{ id: 'first', name: 'First name', selector: r => r.firstName, sortable: true, reorder: true },
	{ id: 'last', name: 'Last name', selector: r => r.lastName, sortable: true, reorder: true },
	{ id: 'dept', name: 'Department', selector: r => r.department, sortable: true, reorder: true },
	{
		id: 'base',
		name: 'Base salary',
		selector: r => r.baseSalary,
		sortable: true,
		reorder: true,
		right: true,
		format: r => `$${r.baseSalary.toLocaleString()}`,
	},
	{
		id: 'bonus',
		name: 'Bonus',
		selector: r => r.bonus,
		sortable: true,
		reorder: true,
		right: true,
		format: r => `$${r.bonus.toLocaleString()}`,
	},
];

const initialGroups: ColumnGroup[] = [
	{ name: 'Employee', columnIds: ['first', 'last', 'dept'], reorder: true },
	{ name: 'Compensation', columnIds: ['base', 'bonus'], reorder: true },
];

export default function DraggableGroupsDemo() {
	const [columns, setColumns] = useState(initialColumns);
	const [groups, setGroups] = useState(initialGroups);

	return (
		<div className="space-y-3">
			<p className="text-xs text-gray-400">
				Drag a group header to move the whole group. Drag an individual column header to reorder it within its group.
			</p>
			<DataTable
				columns={columns}
				data={data}
				columnGroups={groups}
				onColumnOrderChange={setColumns}
				onColumnGroupOrderChange={(nextGroups, nextCols) => {
					setGroups(nextGroups);
					setColumns(nextCols);
				}}
				highlightOnHover
			/>
			<p className="text-xs text-gray-400">
				Group order: <span className="font-mono text-gray-600">{groups.map(g => g.name).join(' → ')}</span>
			</p>
		</div>
	);
}
