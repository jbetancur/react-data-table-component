import React from 'react';
import tableDataItems from '../../constants/sampleDesserts';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		fixed: true,
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
		fixed: true,
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
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
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
	},
];

const conditionalRowStyles = [
	{
		when: row => row.calories < 300,
		style: {
			backgroundColor: 'rgba(63, 195, 128, 0.9)',
			color: 'white',
			'&:hover': {
				cursor: 'pointer',
			},
		},
	},
	{
		when: row => row.calories >= 300 && row.calories < 400,
		style: {
			backgroundColor: 'rgba(248, 148, 6, 0.9)',
			color: 'white',
			'&:hover': {
				cursor: 'pointer',
			},
		},
	},
	{
		when: row => row.calories >= 400,
		style: {
			backgroundColor: 'rgba(242, 38, 19, 0.9)',
			color: 'white',
			'&:hover': {
				cursor: 'not-allowed',
			},
		},
	},
];

export const Rows = () => (
	<DataTable
		title="Desserts - Conditional Rows"
		columns={columns}
		data={tableDataItems}
		conditionalRowStyles={conditionalRowStyles}
		pagination
	/>
);

export default {
	title: 'Conditional Rows/Rows',
	component: Rows,
};
