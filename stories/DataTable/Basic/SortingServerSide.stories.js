import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { orderBy } from 'lodash';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';
import { getProperty} from '../../../src/DataTable/util'

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		filterable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		filterable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

const SortingServerSide = () => {
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

	const handleFilter = (filters) => {
		// simulate server sort

		setLoading(true);

		// instead of setTimeout this is where you would handle your API call.
		setTimeout(() => {
			const filteredRows = data.filter((row,idx) => Object.entries(filters)  //
			.reduce((acc, [_, { column, value }]) =>
				(new RegExp(`.*${value}.*`, 'i')).test(getProperty(row,column.selector,null,idx)?.toString() ?? "") ? acc : false, true))
			setData(filteredRows)
			setLoading(false);
		}, 100);
	};

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={items}
			onSort={handleSort}
			onFilter={ handleFilter}
			sortServer
			progressPending={loading}
			persistTableHead
		/>
	);
};

storiesOf('Sorting', module).add('Server-Side', () => <SortingServerSide />);
