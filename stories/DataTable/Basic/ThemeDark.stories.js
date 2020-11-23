import React from 'react';
import { storiesOf } from '@storybook/react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

const DarkTable = () => {
	const [theme, setTheme] = React.useState('dark');

	const handleChange = () => {
		if (theme === 'dark') {
			setTheme('default');
		} else {
			setTheme('dark');
		}
	};

	return (
		<>
			<FormControlLabel label="Dark Mode" control={<Switch checked={theme === 'dark'} onChange={handleChange} />} />
			<DataTable
				title="Movie List"
				columns={columns}
				data={data}
				theme={theme}
				highlightOnHover
				pointerOnHover
				pagination
				selectableRows
				expandableRows
			/>
		</>
	);
};

storiesOf('Theming', module).add('Built in Themes', DarkTable);
