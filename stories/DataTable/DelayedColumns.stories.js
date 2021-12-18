import React, { useState, useEffect } from 'react';
import users from '../shared/users';
import DataTable from '../../src/index';

export const Delayed = () => {
	const [columns, setColumns] = useState([]);
	const [pending, setPending] = React.useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setColumns([
				{
					name: 'Name',
					selector: row => row.name,
					sortable: true,
				},
				{
					name: 'Email',
					selector: row => row.email,
					sortable: true,
				},
				{
					name: 'Address',
					selector: row => row.address,
					sortable: true,
				},
			]);
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, []);

	return <DataTable columns={columns} data={users} progressPending={pending} />;
};

export default {
	title: 'Columns/Delayed',
	Component: Delayed,
};
