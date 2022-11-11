import React from 'react';

import DataTable from '../../../src/DataTable/DataTable';
import tableDataItems from '../../constants/sampleMovieData';

const columns = [
	{
		name: 'ID',
		selector: row => row.id,
		sortable: true,
		wrap: true,
	},
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		wrap: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
		wrap: true,
	},
	{
		name: 'Runtime',
		selector: row => row.runtime,
		sortable: true,
		wrap: true,
	},
];

const GroupByStory = props => {
	return <DataTable {...props} data={tableDataItems} />;
};
const Template = args => <GroupByStory {...args} />;

export const GroupBy = Template.bind({});

GroupBy.args = {
	title: 'Movie List Grouped',
	columns: columns,
	pagination: true,
	groupByKey: row => `Year: ${row.year} - Runtime: ${row.runtime}`,
	groupLabel: group => `${group._groupKey} (${group.groupData.length} items)`,
};

export default {
	title: 'Expandable/Group By ',
	component: GroupBy,
	parameters: {},
};
