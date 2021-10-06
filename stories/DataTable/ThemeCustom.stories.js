import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable, { createTheme } from '../../src/index';

// createTheme creates a new theme named solarized that overrides the build in dark theme
createTheme(
	'solarized',
	{
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
	},
	'dark',
);

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

export const Custom = () => (
	<DataTable title="Solarized Movie List" columns={columns} data={data} theme="solarized" selectableRows pagination />
);

export default {
	title: 'Theming/Custom ',
	component: Custom,
};
