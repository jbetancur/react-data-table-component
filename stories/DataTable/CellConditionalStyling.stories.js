import React from 'react';
import tableDataItems from '../constants/sampleDesserts';
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
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
		conditionalCellStyles: [
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
		],
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
		conditionalCellStyles: [
			{
				when: row => row.fat <= 5,
				style: {
					backgroundColor: 'rgba(63, 195, 128, 0.9)',
					color: 'white',
					'&:hover': {
						cursor: 'pointer',
					},
				},
			},
			{
				when: row => row.fat > 5 && row.fat < 10,
				style: {
					backgroundColor: 'rgba(248, 148, 6, 0.9)',
					color: 'white',
					'&:hover': {
						cursor: 'pointer',
					},
				},
			},
			{
				when: row => row.fat > 10,
				style: {
					backgroundColor: 'rgba(242, 38, 19, 0.9)',
					color: 'white',
					'&:hover': {
						cursor: 'not-allowed',
					},
				},
			},
		],
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

export const ConditionalStyling = () => (
	<DataTable title="Desserts - Conditional Cells" columns={columns} data={tableDataItems} />
);

export default {
	title: 'Columns/Cells/Conditional Styling',
	component: ConditionalStyling,
};
