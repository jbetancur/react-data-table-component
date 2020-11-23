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

const isExpanded = row => row.defaultExpanded;

const BasicTableDefaultRowExpanded = () => {
	const data = tableDataItems;
	data[0].defaultExpanded = true;

	return (
		<DataTable
			title="Movie List - First row expanded"
			columns={columns}
			data={data}
			expandableRows
			expandableRowExpanded={isExpanded}
			expandableRowsComponent={<ExpandedComponent />}
		/>
	);
};

storiesOf('Expandable Rows', module).add('Default Expanded Row', BasicTableDefaultRowExpanded);
