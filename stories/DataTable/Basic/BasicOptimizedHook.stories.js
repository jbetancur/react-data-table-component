import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../../src/index';

const OptimizedHooks = () => {
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
		],
		[],
	);

	return (
		<DataTable
			title="Desserts"
			data={tableDataItems}
			columns={columns}
			onSelectedRowsChange={handleChange}
			selectableRows
		/>
	);
};

storiesOf('General', module).add('Optimized: Hooks', () => <OptimizedHooks />);
