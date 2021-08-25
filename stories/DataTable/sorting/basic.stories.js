import React from 'react';
import doc from './basic.mdx';
import data from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

const customSort = (rows, selector, direction) => {
	return rows.sort((a, b) => {
		// use the selector to resolve your field names by passing the sort comparitors
		const aField = selector(a).toLowerCase();
		const bField = selector(b).toLowerCase();

		let comparison = 0;

		if (aField > bField) {
			comparison = 1;
		} else if (aField < bField) {
			comparison = -1;
		}

		return direction === 'desc' ? comparison * -1 : comparison;
	});
};

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

export function Basic() {
	// eslint-disable-next-line no-console
	const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={data}
			onSort={handleSort}
			sortFunction={customSort}
			pagination
		/>
	);
}

export default {
	title: 'Sorting/Basic',
	component: Basic,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
