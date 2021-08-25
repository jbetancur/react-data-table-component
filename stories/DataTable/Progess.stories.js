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

export const Basic = () => {
	const [pending, setPending] = React.useState(true);
	const [rows, setRows] = React.useState([]);
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setRows(data);
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, []);

	return <DataTable title="Movie List" columns={columns} data={rows} progressPending={pending} pagination />;
};

export default {
	title: 'Loading/Basic',
	component: Basic,
};
