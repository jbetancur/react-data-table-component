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

const PaginationPositionTop = () => (
	<DataTable title="Movie List" columns={columns} data={data} pagination paginationPosition="top" subHeader />
);

storiesOf('Pagination', module).add('Pagination Top Position', PaginationPositionTop);
