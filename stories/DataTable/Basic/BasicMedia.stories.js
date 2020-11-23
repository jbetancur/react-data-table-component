import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleDesserts';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Name',
		selector: 'name',
		sortable: true,
		grow: 2,
	},
	{
		name: 'Type',
		selector: 'type',
		sortable: true,
		hide: 'sm',
	},
	{
		name: 'Calories (g)',
		selector: 'calories',
		sortable: true,
		right: true,
	},
	{
		name: 'Fat (g)',
		selector: 'fat',
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Carbs (g)',
		selector: 'carbs',
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Protein (g)',
		selector: 'protein',
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Sodium (mg)',
		selector: 'sodium',
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Calcium (%)',
		selector: 'calcium',
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Iron (%)',
		selector: 'iron',
		sortable: true,
		right: true,
		hide: 'md',
	},
];
const BasicTable = () => {
	// eslint-disable-next-line no-console
	const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

	return <DataTable title="Desserts" columns={columns} data={data} onSort={handleSort} />;
};

storiesOf('General', module).add('Responsive Hiding Columns', BasicTable);
