import React from 'react';
import doc from './table.mdx';
import differenceBy from 'lodash/differenceBy';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import tableDataItems from '../../constants/sampleDesserts';
import DataTable from '../../../src/index';

const sortIcon = <ArrowDownward />;
const selectProps = { indeterminate: isIndeterminate => isIndeterminate };
const actions = (
	<IconButton color="primary">
		<Add />
	</IconButton>
);
const contextActions = deleteHandler => (
	<IconButton color="secondary" onClick={deleteHandler}>
		<Delete />
	</IconButton>
);

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		grow: 2,
		reorder: true,
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Protein (g)',
		selector: row => row.protein,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Sodium (mg)',
		selector: row => row.sodium,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Calcium (%)',
		selector: row => row.calcium,
		sortable: true,
		right: true,
		reorder: true,
	},
	{
		name: 'Iron (%)',
		selector: row => row.iron,
		sortable: true,
		right: true,
		reorder: true,
	},
];

function MaterialStory({ selectableRows, expandableRows }) {
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [data, setData] = React.useState(tableDataItems);

	const handleChange = () => {
		setSelectedRows(selectedRows);
	};

	const handleRowClicked = row => {
		// eslint-disable-next-line no-console
		console.log(`${row.name} was clicked!`);
	};

	const handleRowRightClicked = row => {
		// eslint-disable-next-line no-console
		console.log(`${row.name} was right clicked!`);
	};

	const deleteAll = () => {
		const rows = selectedRows.map(r => r.name);
		// eslint-disable-next-line no-alert
		if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
			setToggleCleared(!toggleCleared);
			setData(differenceBy(data, selectedRows, 'name'));
		}
	};

	return (
		<Card style={{ height: '100%' }}>
			<DataTable
				title="Desserts"
				columns={columns}
				data={data}
				defaultSortFieldId={1}
				selectableRows={selectableRows}
				highlightOnHover
				defaultSortField="name"
				actions={actions}
				contextActions={contextActions(deleteAll)}
				sortIcon={sortIcon}
				selectableRowsComponent={Checkbox}
				selectableRowsComponentProps={selectProps}
				onSelectedRowsChange={handleChange}
				clearSelectedRows={toggleCleared}
				onRowClicked={handleRowClicked}
				onRowRightClicked={handleRowRightClicked}
				pagination
				expandableRows={expandableRows}
			/>
		</Card>
	);
}

const Template = args => <MaterialStory {...args} />;

export const Table = Template.bind({});

Table.args = {
	selectableRows: true,
	expandableRows: true,
};

export default {
	title: 'UI Library/Material UI/Table',
	component: Table,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
