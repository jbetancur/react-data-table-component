import React from 'react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
		fixed: true,
	},
	{
		name: 'Type',
		selector: row => row.type,
		sortable: true,
		fixed: true,
	},
	{
		name: 'Calories (g)',
		selector: row => row.calories,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.calories, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Fat (g)',
		selector: row => row.fat,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.fat, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Carbs (g)',
		selector: row => row.carbs,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.carbs, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Protein (g)',
		selector: row => row.protein,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.protein, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Sodium (mg)',
		selector: row => row.sodium,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.sodium, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Calcium (%)',
		selector: row => row.calcium,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.calcium, 0);
			return Math.round(total);
		},
	},
	{
		name: 'Iron (%)',
		selector: row => row.iron,
		sortable: true,
		right: true,
		footerContent: rows => {
			const total = rows.reduce((acc, row) => acc + row.iron, 0);
			return Math.round(total);
		},
	},
];

export const Footer = () => {
	return <DataTable title="Movie List" columns={columns} data={tableDataItems} showFooter />;
};

export default {
	title: 'Footer/Basic',
	component: Footer,
};
