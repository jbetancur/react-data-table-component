import React from 'react';
import { storiesOf } from '@storybook/react';
import orderBy from 'lodash/orderBy';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

// eslint-disable-next-line arrow-body-style
const customSort = (rows, field, direction) => {
	const handleField = row => {
		if (row[field]) {
			return row[field].toLowerCase();
		}

		return row[field];
	};

	return orderBy(rows, handleField, direction);
};

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

const BasicTable = () => {
	// eslint-disable-next-line no-console
	const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

	return <DataTable title="Movie List" columns={columns} data={data} onSort={handleSort} sortFunction={customSort} />;
};

storiesOf('Sorting', module).add('Custom Sort Function', BasicTable);
