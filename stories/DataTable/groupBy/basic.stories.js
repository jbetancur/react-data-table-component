import React from 'react';
import * as _ from 'lodash-es';

import tableDataItems from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';
import Row from '../../../src/DataTable/TableRow';

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

const BasicStory = () => {
	const props = Basic.args;
	if (props.groupKey) {
		const dataByGroupKey = _.groupBy(tableDataItems, row => props.groupKey(row));
		const groupedData = _.map(dataByGroupKey, (group, key) => {
			return {
				_groupKey: key,
				...((props.groupValues && props.groupValues(group)) || {}),
				groupData: _.map(group, row => {
					return {
						...row,
					};
				}),
			};
		});

		return (
			<DataTable
				data={groupedData}
				columns={[
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
				]}
				expandableRows
				expandableRowsComponent={({ data, rowProps }) => {
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
				}}
			/>
		);
	}
	return <DataTable title="Movie List" columns={columns} data={tableDataItems} pagination />;
};
const Template = args => <BasicStory {...args} />;

export const Basic = Template.bind({});

Basic.args = {
	expandableRows: true,
	expandOnRowClicked: false,
	expandOnRowDoubleClicked: false,
	expandableRowsHideExpander: false,
	groupKey: row => `Year: ${row.year} - Runtime: ${row.runtime}`,
	groupValues: data => {
		return {
			count: data.length,
		};
	},
};

export default {
	title: 'GroupBy/Basic',
	component: Basic,
	parameters: {},
};
