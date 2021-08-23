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

export const PreDisabled = () => {
	const data = tableDataItems.map(item => {
		let disabled = false;
		if (Number(item.year) < 2000) {
			disabled = true;
		}
		return { ...item, disabled };
	});
	return (
		<DataTable
			title="Movie List - No additional info for old movies (Before 2000)"
			columns={columns}
			data={data}
			expandableRows
			expandableRowDisabled={row => row.disabled}
			expandableRowsComponent={ExpandedComponent}
			pagination
		/>
	);
};

export default {
	title: 'Expandable/Pre Disabled ',
	component: PreDisabled,
};
