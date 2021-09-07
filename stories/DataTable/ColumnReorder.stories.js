import React from 'react';
import data from '../constants/sampleDesserts';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		grow: 2,
		reorder: true,
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Protein (g)',
		selector: row => row.protein,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Sodium (mg)',
		selector: row => row.sodium,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Calcium (%)',
		selector: row => row.calcium,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Iron (%)',
		selector: row => row.iron,
		sortable: true,
		right: true,
		reorder: true,
	},
];

export const Reorder = () => {
	return <DataTable title="Desserts" columns={columns} data={data} onColumnOrderChange={cols => console.log(cols)} />;
};

export default {
	title: 'Columns/Reorder',
};
