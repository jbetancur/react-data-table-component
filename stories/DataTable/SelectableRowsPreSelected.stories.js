import React from 'react';
import DataTable from '../../src/index';
import data from '../constants/sampleDesserts';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
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
		selector: row => row.protien,
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

const rowSelectCritera = row => row.fat > 6;

export const PreSelected = () => (
	<DataTable title="Desserts" columns={columns} data={data} selectableRows selectableRowSelected={rowSelectCritera} />
);

export default {
	title: 'Selectable/Pre Selected',
	component: PreSelected,
};
