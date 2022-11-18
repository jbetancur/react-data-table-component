import React from 'react';
import * as _ from 'lodash-es';

import DataTable from '../../../src/DataTable/DataTable';
import Row from '../../../src/DataTable/TableRow';
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

const ExpandedComponent = ({ data, rowProps }) => {
	let rowPropsPlus = {
		...rowProps,
		defaultExpanderDisabled: true,
		expandableIcon: {
			collapsed: '',
			expandable: '',
		},
	};
	return _.map(data.groupData, item => (
		<Row
			{...rowPropsPlus}
			key={`group-row-${item.id}`}
			keyField={`group-row-${item.id}`}
			id={`group-row-${item.id}`}
			row={item}
		/>
	));
};

const GroupByStory = props => {
	//TODO: Move the following lines in DataTable.
	return (
		<DataTable
			{...props}
			groupByKey={props.groupByKey}
			groupLabel={props.groupLabel}
			title="Movie List Grouped"
			data={tableDataItems}
			columns={columns}
			expandableRowsComponent={ExpandedComponent}
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
