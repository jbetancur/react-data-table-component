import React, { useMemo, useState, useCallback, useEffect } from 'react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../src/index';

export const HookComponent = () => {
	const [selectedRows, setSelectedRows] = useState([]);

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.log('state', selectedRows);
	}, [selectedRows]);

	const handleButtonClick = () => {
		// eslint-disable-next-line no-console
		console.log('clicked');
	};

	const handleChange = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	const columns = useMemo(
		() => [
			{
				// eslint-disable-next-line react/button-has-type
				cell: () => <button onClick={handleButtonClick}>Action</button>,
				ignoreRowClick: true,
				allowOverflow: true,
				button: true,
			},
			{
				name: 'Name',
				selector: row => row.name,
				sortable: true,
				grow: 2,
			},
			{
				name: 'Type',
				selector: row => row.type,
				sortable: true,
			},
			{
				name: 'Calories (g)',
				selector: row => row.calories,
				sortable: true,
				right: true,
			},
			{
				name: 'Fat (g)',
				selector: row => row.fat,
				sortable: true,
				right: true,
			},
			{
				name: 'Carbs (g)',
				selector: row => row.carbs,
				sortable: true,
				right: true,
			},
			{
				name: 'Protein (g)',
				selector: row => row.protein,
				sortable: true,
				right: true,
			},
			{
				name: 'Sodium (mg)',
				selector: row => row.sodium,
				sortable: true,
				right: true,
			},
			{
				name: 'Calcium (%)',
				selector: row => row.calcium,
				sortable: true,
				right: true,
			},
			{
				name: 'Iron (%)',
				selector: row => row.iron,
				sortable: true,
				right: true,
			},
		],
		[],
	);

	return (
		<DataTable
			title="Desserts"
			data={tableDataItems}
			columns={columns}
			selectableRows
			onSelectedRowsChange={handleChange}
		/>
	);
};

export default {
	title: 'Performance/Examples/Hook Component',
	component: HookComponent,
};
