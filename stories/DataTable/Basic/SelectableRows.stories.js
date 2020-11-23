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
		name: 'Genres',
		selector: 'genres',
		// eslint-disable-next-line react/no-array-index-key
		cell: row => row.genres.map((genre, i) => <div key={i}>{genre}</div>),
	},
	{
		name: 'Year',
		selector: 'year',
		sortable: true,
	},
];

const BasicSelectable = () => (
	<DataTable title="Movie List" columns={columns} data={data} selectableRows highlightOnHover pagination />
);

storiesOf('Selectable Rows', module).add('Default', BasicSelectable);
