import React from 'react';
import data from '../constants/sampleDesserts';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		grow: 2,
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
		hide: 'sm',
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Protein (g)',
		selector: row => row.protein,
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Sodium (mg)',
		selector: row => row.sodium,
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Calcium (%)',
		selector: row => row.calcium,
		sortable: true,
		right: true,
		hide: 'md',
	},
	{
		name: 'Iron (%)',
		selector: row => row.iron,
		sortable: true,
		right: true,
		hide: 'md',
	},
];
export const HideOnResize = () => {
	// eslint-disable-next-line no-console
	const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

	return <DataTable title="Desserts" columns={columns} data={data} onSort={handleSort} />;
};

export default {
	title: 'Columns/Hide On Resize',
};
