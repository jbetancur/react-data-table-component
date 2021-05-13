import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
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
		filterable: true
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		filterable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

const BasicTable = () => {
	// eslint-disable-next-line no-console
	const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

	return <DataTable title="Movie List" columns={columns} data={data} onSort={handleSort} sortFunction={customSort} />;
};

storiesOf('Sorting', module).add('Custom Sort Function', BasicTable);
