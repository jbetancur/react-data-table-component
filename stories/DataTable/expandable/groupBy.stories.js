import React from 'react';

import DataTable from '../../../src/DataTable/DataTable';
import tableDataItems from '../../constants/sampleMovieData';

const columns = [
	{
		name: 'ID',
		selector: row => row.id,
		wrap: true,
	},
	{
		name: 'Title',
		selector: row => row.title,
		wrap: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		wrap: true,
	},
	{
		name: 'Runtime',
		selector: row => row.runtime,
		wrap: true,
	},
];

const GroupByStory = props => {
	return (
		<DataTable
			{...props}
			groupByKey={props.groupByKey}
			groupLabel={props.groupLabel}
			title="Movie List Grouped"
			data={tableDataItems}
			columns={columns}
		/>
	);
};
const Template = args => <GroupByStory {...args} />;

export const GroupBy = Template.bind({});

GroupBy.args = {
	expandableRows: true,
	pagination: true,
	groupByKey: row => `Year: ${row.year} - Runtime: ${row.runtime}`,
	groupLabel: group => `${group._groupKey} (${group.groupData.length} items)`,
};

export default {
	title: 'Expandable/Group By ',
	component: GroupBy,
	parameters: {},
};
