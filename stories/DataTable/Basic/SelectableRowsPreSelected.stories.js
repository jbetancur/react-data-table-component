import { storiesOf } from '@storybook/react';
import React from 'react';

import DataTable from '../../../src/index';
import data from '../constants/sampleDesserts';

const columns = [
	{
		name: 'Name',
		selector: 'name',
		sortable: true,
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
	},
];

const rowSelectCritera = row => row.fat > 6;

const BasicSelectDisabledRow = () => (
	<DataTable title="Desserts" columns={columns} data={data} selectableRows selectableRowSelected={rowSelectCritera} />
);

storiesOf('Selectable Rows', module).add('Pre-selected Row', BasicSelectDisabledRow);
