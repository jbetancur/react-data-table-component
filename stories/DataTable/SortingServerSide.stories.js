import React, { useState } from 'react';
import { orderBy } from 'lodash';
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

export const RemoteSort = () => {
	const [loading, setLoading] = useState(false);
	const [items, setData] = useState(data);

	const handleSort = (column, sortDirection) => {
		// simulate server sort
		setLoading(true);

		// instead of setTimeout this is where you would handle your API call.
		setTimeout(() => {
			setData(orderBy(items, column.selector, sortDirection));
			setLoading(false);
		}, 100);
	};

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={items}
			onSort={handleSort}
			sortServer
			progressPending={loading}
			persistTableHead
		/>
	);
};

export default {
	title: 'Sorting/Remote Sort',
	component: RemoteSort,
};
