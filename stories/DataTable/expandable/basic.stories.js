import React from 'react';
import doc from './basic.mdx';
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

const BasicStory = ({ expandableRows, expandOnRowClicked, expandOnRowDoubleClicked, expandableRowsHideExpander }) => (
	<DataTable
		title="Movie List"
		columns={columns}
		data={tableDataItems}
		expandableRows={expandableRows}
		expandableRowsComponent={ExpandedComponent}
		expandOnRowClicked={expandOnRowClicked}
		expandOnRowDoubleClicked={expandOnRowDoubleClicked}
		expandableRowsHideExpander={expandableRowsHideExpander}
		pagination
	/>
);

const Template = args => <BasicStory {...args} />;

export const Basic = Template.bind({});

Basic.args = {
	expandableRows: true,
	expandOnRowClicked: false,
	expandOnRowDoubleClicked: false,
	expandableRowsHideExpander: false,
};

export default {
	title: 'Expandable/Basic',
	component: Basic,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
