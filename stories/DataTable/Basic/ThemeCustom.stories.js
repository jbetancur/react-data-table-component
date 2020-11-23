import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable, { createTheme } from '../../../src/index';

createTheme('solarized', {
	text: {
		primary: '#268bd2',
		secondary: '#2aa198',
	},
	background: {
		default: '#002b36',
	},
	context: {
		background: '#cb4b16',
		text: '#FFFFFF',
	},
	divider: {
		default: '#073642',
	},
	button: {
		default: '#2aa198',
		hover: 'rgba(0,0,0,.08)',
		focus: 'rgba(255,255,255,.12)',
		disabled: 'rgba(255, 255, 255, .34)',
	},
	sortFocus: {
		default: '#2aa198',
	},
});

const columns = [
	{
		name: 'Title',
		selector: 'title',
		sortable: true,
	},
	{
		name: 'Director',
		selector: 'director',
		sortable: true,
	},
	{
		name: 'Year',
		selector: 'year',
		sortable: true,
	},
];

const CreatePaletteTheme = () => (
	<DataTable title="Solarized Movie List" columns={columns} data={data} pagination theme="solarized" selectableRows />
);

storiesOf('Theming', module).add('Create Theme', CreatePaletteTheme);
