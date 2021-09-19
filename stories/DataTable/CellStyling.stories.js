import React from 'react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		grow: 2,
		style: {
			backgroundColor: 'rgba(63, 195, 128, 0.9)',
			color: 'white',
		},
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Protein (g)',
		selector: row => row.protein,
		sortable: true,
		right: true,
	},
	{
		name: 'Sodium (mg)',
		selector: row => row.sodium,
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Calcium (%)',
		selector: row => row.calcium,
		sortable: true,
		right: true,
	},
	{
		name: 'Iron (%)',
		selector: row => row.iron,
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
];

export const StaticStyling = () => (
	<DataTable title="Desserts - Cell Styling" columns={columns} data={tableDataItems} />
);

export default {
	title: 'Columns/Cells/Static Styling',
	component: StaticStyling,
};
