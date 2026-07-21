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
	{ id: 11, name: 'Riley Nguyen', department: 'Engineering', salary: 149000, hired: '2019-06-24' },
	{ id: 12, name: 'Jamie Foster', department: 'Analytics', salary: 121000, hired: '2021-10-03' },
	{ id: 13, name: 'Quinn Alvarez', department: 'Product', salary: 145000, hired: '2018-05-17' },
	{ id: 14, name: 'Reese Kim', department: 'Design', salary: 112000, hired: '2023-01-09' },
	{ id: 15, name: 'Devon Wright', department: 'Engineering', salary: 158000, hired: '2016-12-01' },
	{ id: 16, name: 'Harper Diaz', department: 'Sales', salary: 99000, hired: '2022-06-28' },
	{ id: 17, name: 'Emerson Cole', department: 'Analytics', salary: 136000, hired: '2020-09-11' },
	{ id: 18, name: 'Sasha Petrov', department: 'Engineering', salary: 141000, hired: '2021-03-19' },
	{ id: 19, name: 'Blake Turner', department: 'Product', salary: 127000, hired: '2019-11-25' },
	{ id: 20, name: 'Rowan Mitchell', department: 'Design', salary: 115000, hired: '2022-08-02' },
	{ id: 21, name: 'Kai Nakamura', department: 'Engineering', salary: 167000, hired: '2017-04-14' },
	{ id: 22, name: 'Logan Reyes', department: 'Sales', salary: 102000, hired: '2023-05-30' },
	{ id: 23, name: 'Skyler Bennett', department: 'Analytics', salary: 139000, hired: '2018-08-21' },
	{ id: 24, name: 'Parker Hughes', department: 'Product', salary: 133000, hired: '2020-02-06' },
	{ id: 25, name: 'Elliot Ramos', department: 'Design', salary: 121000, hired: '2021-12-13' },
	{ id: 26, name: 'Dakota Silva', department: 'Engineering', salary: 152000, hired: '2019-07-08' },
	{ id: 27, name: 'Micah Owens', department: 'Sales', salary: 96000, hired: '2022-10-17' },
	{ id: 28, name: 'Finley Grant', department: 'Analytics', salary: 147000, hired: '2017-11-29' },
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
	return (
		<DataTable
			columns={columns}
			data={data}
			highlightOnHover
			defaultSortFieldId="name"
			pagination
			paginationPerPage={10}
		/>
	);
}
