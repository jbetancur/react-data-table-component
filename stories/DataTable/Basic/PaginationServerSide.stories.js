import React, { Component } from 'react';
import axios from 'axios';
import { storiesOf } from '@storybook/react';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'First Name',
		selector: 'first_name',
		sortable: true,
	},
	{
		name: 'Last Name',
		selector: 'last_name',
		sortable: true,
	},
	{
		name: 'Email',
		selector: 'email',
		sortable: true,
	},
];

class AdvancedPaginationTable extends Component {
	// eslint-disable-next-line react/state-in-constructor
	state = {
		data: [],
		loading: false,
		totalRows: 0,
		perPage: 10,
	};

	async componentDidMount() {
		const { perPage } = this.state;

		this.setState({ loading: true });

		const response = await axios.get(`https://reqres.in/api/users?page=1&per_page=${perPage}&delay=1`);

		this.setState({
			data: response.data.data,
			totalRows: response.data.total,
			loading: false,
		});
	}

	handlePageChange = async page => {
		const { perPage } = this.state;

		this.setState({ loading: true });

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

		this.setState({
			loading: false,
			data: response.data.data,
		});
	};

	handlePerRowsChange = async (perPage, page) => {
		this.setState({ loading: true });

		const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);

		this.setState({
			loading: false,
			data: response.data.data,
			perPage,
		});
	};

	render() {
		const { loading, data, totalRows } = this.state;

		return (
			<DataTable
				title="Users"
				columns={columns}
				data={data}
				progressPending={loading}
				pagination
				paginationServer
				paginationTotalRows={totalRows}
				onChangeRowsPerPage={this.handlePerRowsChange}
				onChangePage={this.handlePageChange}
			/>
		);
	}
}

storiesOf('Pagination', module).add('Server-Side', () => <AdvancedPaginationTable />);
