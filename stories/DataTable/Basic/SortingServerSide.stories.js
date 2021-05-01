import React from 'react';
import { storiesOf } from '@storybook/react';
import axios from 'axios';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		sortServerField: 'name',
	},
	{
		name: 'min_size',
		selector: row => row.min_size,
		sortable: true,
		sortServerField: 'min_size',
	},
];

const SortingServerSide = () => {
	const [data, setData] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const fetchUsers = async () => {
		setLoading(true);

		const response = await axios.get(`https://api.coinbase.com/v2/currencies?sort=name&order=asc&page=1&limit=10`);
		console.log(response.data);
		setData(response.data.data);
		setLoading(false);
	};

	const handleSort = async (column, sortDirection) => {
		// simulate server sorthttps://api.github.com/users/jbetancur/repos?sort=created&direction=desc
		setLoading(true);

		const response = await axios.get(
			`https://api.coinbase.com/v2/currencies?sort=${column.sortableField}&order=${sortDirection}&page=1&limit=10`,
		);

		setData(response.data.data);
		setLoading(false);
	};

	const handleChangePage = async ({ page, selectedColumn, sortDirection }) => {
		setLoading(true);

		const response = await axios.get(
			`https://api.coinbase.com/v2/currencies?sort=${
				selectedColumn.sortableField
			}&order=${sortDirection}&page=${page}&limit=${10}`,
		);

		setData(response.data);
		setLoading(false);
	};

	React.useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DataTable
			title="Currencies"
			columns={columns}
			data={data}
			onSort={handleSort}
			sortServer
			progressPending={loading}
			persistTableHead
			pagination
			paginationServer
			paginationServerOptions={{
				totalRows: 31,
			}}
			onChangePage={handleChangePage}
			defaultSortFieldId={1}
			// pagination
		/>
	);
};

storiesOf('Sorting', module).add('Server-Side', () => <SortingServerSide />);
