import React from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Name',
		selector: 'name',
		sortable: true,
		grow: 2,
		style: {
			backgroundColor: 'rgba(63, 195, 128, 0.9)',
			color: 'white',
		},
	},
	{
		name: 'Type',
		selector: 'type',
		sortable: true,
	},
	{
		name: 'Calories (g)',
		selector: 'calories',
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Fat (g)',
		selector: 'fat',
		sortable: true,
		right: true,
	},
	{
		name: 'Carbs (g)',
		selector: 'carbs',
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Protein (g)',
		selector: 'protein',
		sortable: true,
		right: true,
	},
	{
		name: 'Sodium (mg)',
		selector: 'sodium',
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
	{
		name: 'Calcium (%)',
		selector: 'calcium',
		sortable: true,
		right: true,
	},
	{
		name: 'Iron (%)',
		selector: 'iron',
		sortable: true,
		right: true,
		style: {
			backgroundColor: 'rgba(187, 204, 221, 1)',
		},
	},
];

const CellStatic = () => <DataTable title="Desserts - Cell Styling" columns={columns} data={tableDataItems} />;

storiesOf('Custom Styling', module).add('Column Styling', CellStatic);
