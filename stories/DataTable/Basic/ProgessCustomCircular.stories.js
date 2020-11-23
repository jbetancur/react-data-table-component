import React from 'react';
import { storiesOf } from '@storybook/react';
import CircularProgress from '@material-ui/core/CircularProgress';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Title',
		selector: 'title',
		sortable: true,
	},
	{
		name: 'Director',
		selector: 'director',
		sortable: true,
	},
	{
		name: 'Year',
		selector: 'year',
		sortable: true,
	},
];

const Circular = () => (
	// we need to add some padding to circular progress to keep it from activating our scrollbar
	<div style={{ padding: '24px' }}>
		<CircularProgress size={75} />
	</div>
);

const ProgressPendingIndeterminate = () => {
	const [pending, setPending] = React.useState(true);
	const [rows, setRows] = React.useState([]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setRows(data);
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={rows}
			progressPending={pending}
			progressComponent={<Circular />}
			pagination
		/>
	);
};

storiesOf('Progress Indicator', module).add('Material UI Circular', () => <ProgressPendingIndeterminate />);
