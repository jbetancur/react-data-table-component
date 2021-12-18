import React from 'react';
import doc from './basic.mdx';
import data from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

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

export const Basic = () => {
	return <DataTable title="Movie List" columns={columns} data={data} pagination />;
};

export default {
	title: 'Sorting/Basic',
	component: Basic,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
