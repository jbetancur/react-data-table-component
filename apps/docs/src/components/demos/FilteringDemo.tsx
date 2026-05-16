import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	hired: string;
}

const data: Employee[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000, hired: '2019-03-12' },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000, hired: '2020-07-01' },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000, hired: '2021-01-15' },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000, hired: '2018-11-30' },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000, hired: '2022-04-22' },
	{ id: 6, name: 'Taylor Brooks', department: 'Sales', salary: 97000, hired: '2023-02-08' },
	{ id: 7, name: 'Morgan Lee', department: 'Engineering', salary: 162000, hired: '2017-09-05' },
	{ id: 8, name: 'Casey Park', department: 'Design', salary: 109000, hired: '2022-11-19' },
	{ id: 9, name: 'Drew Santos', department: 'Product', salary: 138000, hired: '2020-03-30' },
	{ id: 10, name: 'Avery Johnson', department: 'Sales', salary: 104000, hired: '2021-08-14' },
];

const columns: TableColumn<Employee>[] = [
	{
		id: 'name',
		name: 'Name',
		selector: r => r.name,
		sortable: true,
		filterable: true,
		// filterType defaults to 'text'
	},
	{
		id: 'department',
		name: 'Department',
		selector: r => r.department,
		sortable: true,
		filterable: true,
	},
	{
		id: 'salary',
		name: 'Salary',
		selector: r => r.salary,
		format: r => `$${r.salary.toLocaleString()}`,
		right: true,
		sortable: true,
		filterable: true,
		filterType: 'number',
	},
	{
		id: 'hired',
		name: 'Hired',
		selector: r => r.hired,
		sortable: true,
		filterable: true,
		filterType: 'date',
	},
];

export default function FilteringDemo() {
	return <DataTable columns={columns} data={data} highlightOnHover defaultSortFieldId="name" />;
}
