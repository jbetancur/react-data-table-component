import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storiesOf } from '@storybook/react';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'First Name',
		selector: row => row.first_name,
		sortable: true,
	},
	{
		name: 'Last Name',
		selector: row => row.last_name,
		sortable: true,
	},
	{
		name: 'Email',
		selector: row => row.email,
		sortable: true,
	},
];

const AdvancedPaginationTable = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);

	const fetchUsers = async ({ page }) => {
		setLoading(true);

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = page => {
		fetchUsers(page);
	};

	const handlePerRowsChange = async ({ page, rowsPerPage }) => {
		setLoading(true);

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${rowsPerPage}&delay=1`);

		setData(response.data.data);
		setPerPage(rowsPerPage);
		setLoading(false);
	};

	useEffect(() => {
		fetchUsers(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DataTable
			title="Users"
			columns={columns}
			data={data}
			progressPending={loading}
			pagination
			paginationServer
			paginationServerOptions={{
				totalRows,
			}}
			selectableRows
			onChangeRowsPerPage={handlePerRowsChange}
			onChangePage={handlePageChange}
		/>
	);
};

storiesOf('Pagination', module).add('Server-Side Using Hooks', () => <AdvancedPaginationTable />);
