import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

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

const PaginationPositionBoth = () => (
	<DataTable title="Movie List" columns={columns} data={data} pagination paginationPosition="both" subHeader />
);

storiesOf('Pagination', module).add('Pagination Both Positions', PaginationPositionBoth);
