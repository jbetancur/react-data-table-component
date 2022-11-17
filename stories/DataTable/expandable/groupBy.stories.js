import React from 'react';
import * as _ from 'lodash-es';

import DataTable from '../../../src/DataTable/DataTable';
import Row from '../../../src/DataTable/TableRow';
import tableDataItems from '../../constants/sampleMovieData';

const ExpandedComponent = ({ data, rowProps }) => {
	let rowPropsPlus = {
		...rowProps,
		expandableRows: false,
		columns: [
			{
				id: 0,
				name: 'ID',
				selector: row => row.id,
				sortable: true,
				wrap: true,
			},
			{
				id: 1,
				name: 'Title',
				selector: row => row.title,
				sortable: true,
				wrap: true,
			},
			{
				id: 2,
				name: 'Year',
				selector: row => row.year,
				sortable: true,
				wrap: true,
			},
			{
				id: 3,
				name: 'Runtime',
				selector: row => row.runtime,
				sortable: true,
				wrap: true,
			},
		],
	};
	return _.map(data.groupData, item => {
		return (
			<div key={item.title}>
				<Row {...rowPropsPlus} row={item} />
			</div>
		);
	});
};

const columns = [
	{
		name: 'Group',
		selector: row => row._groupKey,
		sortable: true,
		wrap: true,
	},
	{
		name: 'Count',
		selector: row => row.count,
		sortable: true,
		wrap: true,
	},
];

const GroupByStory = props => {
	const dataByGroupKey = _.groupBy(tableDataItems, row => props.groupKey(row));
	const groupedData = _.map(dataByGroupKey, (group, key) => {
		return {
			_groupKey: key,
			...((props.groupValues && props.groupValues(group)) || {}),
			groupData: _.map(group, row => row),
		};
	});

	return (
		<DataTable
			{...props}
			title="Movie List Grouped"
			data={groupedData}
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
	groupKey: row => `Year: ${row.year} - Runtime: ${row.runtime}`,
	groupValues: data => {
		return {
			count: data.length,
		};
	},
};

export default {
	title: 'Expandable/Group By ',
	component: GroupBy,
	parameters: {},
};
