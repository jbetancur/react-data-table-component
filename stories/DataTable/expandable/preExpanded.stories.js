import React from 'react';
import doc from './preExpanded.mdx';
import tableDataItems from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

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

export const PreExpanded = () => {
	const data = tableDataItems;
	data[0].defaultExpanded = true;

	return (
		<DataTable
			title="Movie List - First row expanded"
			columns={columns}
			data={data}
			expandableRows
			expandableRowExpanded={row => row.defaultExpanded}
			expandableRowsComponent={ExpandedComponent}
			pagination
		/>
	);
};

export default {
	title: 'Expandable/Pre Expanded ',
	component: PreExpanded,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
