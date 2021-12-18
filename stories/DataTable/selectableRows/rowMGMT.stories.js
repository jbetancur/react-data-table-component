import React from 'react';
import doc from './rowMGMT.mdx';
import differenceBy from 'lodash/differenceBy';
import Button from '../../shared/Button';
import tableDataItems from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

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

export const ManageSelections = () => {
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [data, setData] = React.useState(tableDataItems);

	const handleRowSelected = React.useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	const contextActions = React.useMemo(() => {
		const handleDelete = () => {
			// eslint-disable-next-line no-alert
			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
				setToggleCleared(!toggleCleared);
				setData(differenceBy(data, selectedRows, 'title'));
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
			contextActions={contextActions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
			pagination
		/>
	);
};

export default {
	title: 'Selectable/Manage Selections',
	component: ManageSelections,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
