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
	{
		name: 'Out of Stock',
		selector: row => row.isOutOfStock,
		sortable: true,
		cell: row => <div>{row.isOutOfStock ? 'Yes' : 'No'}</div>,
	},
];

const customData = data.map(datum => ({ ...datum, isOutOfStock: false }));

customData[1].isOutOfStock = true;
customData[3].isOutOfStock = true;

const rowDisabledCriteria = row => row.isOutOfStock;

export const PreDisabled = () => (
	<DataTable
		title="Desserts"
		columns={columns}
		data={customData}
		selectableRows
		selectableRowDisabled={rowDisabledCriteria}
	/>
);

export default {
	title: 'Selectable/Pre Disabled',
	component: PreDisabled,
};
