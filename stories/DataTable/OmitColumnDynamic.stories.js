import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';
import Button from '../shared/Button';

export const OmitDynamically = () => {
	const [hideDirector, setHideDirector] = React.useState(false);

	const columns = React.useMemo(
		() => [
			{
				name: 'Title',
				selector: row => row.title,
				sortable: true,
			},
			{
				name: 'Director',
				selector: row => row.director,
				sortable: true,
				omit: hideDirector,
			},
			{
				name: 'Year',
				selector: row => row.year,
				sortable: true,
			},
		],
		[hideDirector],
	);

	return (
		<>
			<Button onClick={() => setHideDirector(!hideDirector)}>Hide Directory Column</Button>
			<DataTable title="Movie List" columns={columns} data={data} pagination />
		</>
	);
};

export default {
	title: 'Columns/Omit Dynamically',
	component: OmitDynamically,
};
