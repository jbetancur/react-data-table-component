import React from 'react';
import { storiesOf } from '@storybook/react';
import differenceBy from 'lodash/differenceBy';
import tableDataItems from '../constants/sampleDesserts';
import Button from '../shared/Button';
import DataTable from '../../../src/index';

const actions = <Button key="add">Add</Button>;
const columns = [
	{
		name: 'Name',
		selector: 'name',
		sortable: true,
		grow: 2,
	},
	{
		name: 'Type',
		selector: 'type',
		sortable: true,
	},
	{
		name: 'Calories (g)',
		selector: 'calories',
		sortable: true,
		right: true,
	},
	{
		name: 'Fat (g)',
		selector: 'fat',
		sortable: true,
		right: true,
	},
	{
		name: 'Carbs (g)',
		selector: 'carbs',
		sortable: true,
		right: true,
	},
	{
		name: 'Protein (g)',
		selector: 'protein',
		sortable: true,
		right: true,
	},
	{
		name: 'Sodium (mg)',
		selector: 'sodium',
		sortable: true,
		right: true,
	},
	{
		name: 'Calcium (%)',
		selector: 'calcium',
		sortable: true,
		right: true,
	},
	{
		name: 'Iron (%)',
		selector: 'iron',
		sortable: true,
		right: true,
	},
];

const SelectableRowsManagement = () => {
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [data, setData] = React.useState(tableDataItems);

	const handleRowSelected = React.useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			// eslint-disable-next-line no-alert
			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
				setToggleCleared(!toggleCleared);
				setData(differenceBy(data, selectedRows, 'name'));
			}
		};

		return (
			<Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
				Delete
			</Button>
		);
	}, [data, selectedRows, toggleCleared]);

	return (
		<DataTable
			title="Desserts"
			columns={columns}
			data={data}
			selectableRows
			actions={actions}
			contextActions={contextActions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
		/>
	);
};

storiesOf('Selectable Rows', module).add('Selected Row Toggle', () => <SelectableRowsManagement />);
