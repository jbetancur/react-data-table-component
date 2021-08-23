import React from 'react';
import tableDataItems from '../constants/sampleMovieData';
import DataTable from '../../src/index';

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

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
		name: 'Genres',
		selector: row => row.genres,
		// eslint-disable-next-line react/no-array-index-key
		cell: row => row.genres.map((genre, i) => <div key={i}>{genre}</div>),
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

const isExpanded = row => row.defaultExpanded;

export const PreExpanded = () => {
	const data = tableDataItems;
	data[0].defaultExpanded = true;

	return (
		<DataTable
			title="Movie List - First row expanded"
			columns={columns}
			data={data}
			expandableRows
			expandableRowExpanded={isExpanded}
			expandableRowsComponent={ExpandedComponent}
			pagination
		/>
	);
};

export default {
	title: 'Expandable/Pre Expanded ',
	component: PreExpanded,
};
