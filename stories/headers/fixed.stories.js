import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
		reorder: true,
	},
];

const FixedHeaderStory = ({ fixedHeader, fixedHeaderScrollHeight }) => (
	<DataTable
		title="Movie List"
		columns={columns}
		data={data}
		fixedHeader={fixedHeader}
		fixedHeaderScrollHeight={fixedHeaderScrollHeight}
		pagination
	/>
);

const Template = args => <FixedHeaderStory {...args} />;

export const FixedHeader = Template.bind({});

FixedHeader.args = {
	fixedHeader: true,
	fixedHeaderScrollHeight: '300px',
};

export default {
	title: 'Headers/Fixed Header',
	component: FixedHeader,
};
