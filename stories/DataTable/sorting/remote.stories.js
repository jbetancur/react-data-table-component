import React, { useState } from 'react';
import doc from './remote.mdx';
import { orderBy } from 'lodash';
import initData from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';
import { getProperty } from '../../../src/DataTable/util';

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		sortField: 'title',
		filterable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		sortField: 'director',
		filterable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
		sortField: 'year',
	},
];

export function RemoteSort() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(initData);

	const handleSort = (column, sortDirection) => {
		// simulate server sort
		console.log(column, sortDirection);
		setLoading(true);

		// instead of setTimeout this is where you would handle your API call.
		setTimeout(() => {
			setData(orderBy(data, column.sortField, sortDirection));
			setLoading(false);
		}, 100);
	};

	const handleFilter = filters => {
		// simulate server sort

		setLoading(true);

		// instead of setTimeout this is where you would handle your API call.
		setTimeout(() => {
			const filteredRows = initData.filter((row, idx) =>
				Object.entries(filters) //
					.reduce((acc, [_, { column, value }]) => {
						return new RegExp(`.*${value}.*`, 'i').test(getProperty(row, column.selector, null, idx)?.toString() ?? '')
							? acc
							: false;
					}, true),
			);
			setData(filteredRows);
			setLoading(false);
		}, 100);
	};

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={data}
			onFilter={handleFilter}
			sortServer
			onSort={handleSort}
			progressPending={loading}
			persistTableHead
			pagination
		/>
	);
}

export default {
	title: 'Sorting/Remote Sort',
	component: RemoteSort,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
