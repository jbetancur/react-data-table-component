import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

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

export const RowLink = () => {
	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={data}
			pagination
			renderRow={(row, rowContent) => (
				<a href={`/${row.id}`} style={{ display: 'block' }} target="_blank" rel="noreferrer">
					{rowContent}
				</a>
			)}
		/>
	);
};

export default {
	title: 'RowLink',
	component: RowLink,
	parameters: {},
};
