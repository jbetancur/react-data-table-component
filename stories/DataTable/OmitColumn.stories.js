import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

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
		omit: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

export const Omit = () => <DataTable title="Movie List" columns={columns} data={data} pagination />;

export default {
	title: 'Columns/Omit',
	component: Omit,
};
