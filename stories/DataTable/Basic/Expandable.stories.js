import React from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleMovieData';
import DataTable from '../../../src/index';
import ExpandedComponent from '../shared/ExpandedComponent';

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

const ExpandableTable = () => (
	<DataTable
		title="Movie List"
		columns={columns}
		data={tableDataItems}
		expandableRows
		expandableRowsComponent={<ExpandedComponent />}
	/>
);

storiesOf('Expandable Rows', module).add('Basic', ExpandableTable);
