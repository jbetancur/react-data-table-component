import React from 'react';
import doc from './linearProgressBar.mdx';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import data from '../../constants/sampleMovieData';
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

const ProgressStory = ({ progressPending, persistTableHead }) => {
	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={data}
			progressPending={progressPending}
			progressComponent={<LinearIndeterminate />}
			persistTableHead={persistTableHead}
			pagination
		/>
	);
};

const Template = args => <ProgressStory {...args} />;

export const Progress = Template.bind({});

Progress.args = {
	persistTableHead: false,
	progressPending: true,
};

export default {
	title: 'UI Library/Material UI/Progress',
	component: Progress,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
