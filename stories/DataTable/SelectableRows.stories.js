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
	},
	{
		name: 'Genres',
		selector: row => row.genres,
		// eslint-disable-next-line react/no-array-index-key
		cell: row => row.genres.map((genre, i) => <div key={i}>{genre}</div>),
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

export const Basic = () => <DataTable title="Movie List" columns={columns} data={data} selectableRows pagination />;

export default {
	title: 'Selectable/Basic',
	component: Basic,
};
