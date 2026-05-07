import React from 'react';
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

const columns: TableColumn<Row>[] = [
	{ id: 'first', name: 'First name', selector: r => r.firstName, sortable: true },
	{ id: 'last', name: 'Last name', selector: r => r.lastName, sortable: true },
	{ id: 'dept', name: 'Department', selector: r => r.department, sortable: true },
	{
		id: 'base',
		name: 'Base salary',
		selector: r => r.baseSalary,
		sortable: true,
		right: true,
		format: r => `$${r.baseSalary.toLocaleString()}`,
	},
	{
		id: 'bonus',
		name: 'Bonus',
		selector: r => r.bonus,
		sortable: true,
		right: true,
		format: r => `$${r.bonus.toLocaleString()}`,
	},
];

const columnGroups: ColumnGroup[] = [
	{ name: 'Employee', columnIds: ['first', 'last', 'dept'] },
	{ name: 'Compensation', columnIds: ['base', 'bonus'] },
];

export default function ColumnGroupsDemo() {
	return <DataTable columns={columns} data={data} columnGroups={columnGroups} highlightOnHover columnSeparator />;
}
