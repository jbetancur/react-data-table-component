import React from 'react';
import { storiesOf } from '@storybook/react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
}));

const LinearIndeterminate = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<LinearProgress />
		</div>
	);
};

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

const ProgressPendingIndeterminateHeader = () => {
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
			progressComponent={<LinearIndeterminate />}
			persistTableHead
		/>
	);
};

storiesOf('Progress Indicator', module).add('Show Table Head', () => <ProgressPendingIndeterminateHeader />);
