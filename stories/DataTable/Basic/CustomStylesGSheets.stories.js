import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from '@material-ui/icons/Apps';
import DataTable from '../../../src/index';
import CustomMaterialMenu from '../shared/CustomMaterialMenu';

const data = [
	{
		id: 1,
		title: 'Cutting Costs',
		by: 'me',
		lastOpened: 'Aug 7 9:52 AM',
	},
	{
		id: 2,
		title: 'Wedding Planner',
		by: 'me',
		lastOpened: 'Sept 14 2:52 PM',
	},
	{
		id: 3,
		title: 'Expense Tracker',
		by: 'me',
		lastOpened: 'Sept 12 2:41 PM',
	},
	{
		id: 4,
		title: 'Home Brew Water Calculator',
		by: 'me',
		lastOpened: 'Jube 3 5:45 PM',
	},
];

const customStyles = {
	headRow: {
		style: {
			border: 'none',
		},
	},
	headCells: {
		style: {
			color: '#202124',
			fontSize: '14px',
		},
	},
	rows: {
		highlightOnHoverStyle: {
			backgroundColor: 'rgb(230, 244, 244)',
			borderBottomColor: '#FFFFFF',
			borderRadius: '25px',
			outline: '1px solid #FFFFFF',
		},
	},
	pagination: {
		style: {
			border: 'none',
		},
	},
};

const columns = [
	{
		cell: () => <Icon style={{ fill: '#43a047' }} />,
		width: '56px', // custom width for icon button
		style: {
			borderBottom: '1px solid #FFFFFF',
			marginBottom: '-1px',
		},
	},
	{
		name: 'Title',
		selector: 'title',
		sortable: true,
		grow: 2,
		style: {
			color: '#202124',
			fontSize: '14px',
			fontWeight: 500,
		},
	},
	{
		name: 'Owner',
		selector: 'by',
		sortable: true,
		style: {
			color: 'rgba(0,0,0,.54)',
		},
	},
	{
		name: 'Last opened',
		selector: 'lastOpened',
		sortable: true,
		style: {
			color: 'rgba(0,0,0,.54)',
		},
	},
	{
		cell: row => <CustomMaterialMenu size="small" row={row} />,
		allowOverflow: true,
		button: true,
		width: '56px',
	},
];

const CustomStylesGSheets = () => (
	<DataTable
		title="Google Sheets-esqe"
		columns={columns}
		data={data}
		customStyles={customStyles}
		highlightOnHover
		pointerOnHover
	/>
);

storiesOf('Custom Styling', module).add('Google Sheets-esqe', CustomStylesGSheets);
