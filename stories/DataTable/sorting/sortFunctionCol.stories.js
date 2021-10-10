import React from 'react';
import doc from './sortFunctionCol.mdx';
import data from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

const caseInsensitiveSort = (rowA, rowB) => {
	const a = rowA.title.toLowerCase();
	const b = rowB.title.toLowerCase();

	if (a > b) {
		return 1;
	}

	if (b > a) {
		return -1;
	}

	return 0;
};

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		sortFunction: caseInsensitiveSort,
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

export const CustomColumnSort = () => {
	return <DataTable title="Movie List" columns={columns} data={data} pagination />;
};

export default {
	title: 'Sorting/Custom Column Sort',
	component: CustomColumnSort,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
