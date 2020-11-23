import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';
import Button from '../shared/Button';

const OmitColumnTable = () => {
	const [hideDirector, setHideDirector] = React.useState(false);

	const columns = React.useMemo(
		() => [
			{
				name: 'Title',
				selector: 'title',
				sortable: true,
			},
			{
				name: 'Director',
				selector: 'director',
				sortable: true,
				omit: hideDirector,
			},
			{
				name: 'Year',
				selector: 'year',
				sortable: true,
			},
		],
		[hideDirector],
	);

	return (
		<>
			<Button onClick={() => setHideDirector(!hideDirector)}>Hide Directory Column</Button>
			<DataTable title="Movie List" columns={columns} data={data} />
		</>
	);
};

storiesOf('General', module).add('Omit Column Dynamically', OmitColumnTable);
