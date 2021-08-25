import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../src/index';

const columns = memoize(clickHandler => [
	{
		// eslint-disable-next-line react/button-has-type
		cell: () => <button onClick={clickHandler}>Action</button>,
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
]);

class ClassicComponentStory extends PureComponent {
	state = {
		selectedRows: [],
	};

	handleButtonClick = () => {
		console.log('clicked');
	};

	handleChange = state => {
		console.log('state', state.selectedRows);
		this.setState({ selectedRows: state.selectedRows });
	};

	render() {
		return (
			<DataTable
				title="Desserts"
				data={tableDataItems}
				columns={columns(this.handleButtonClick)}
				selectableRows
				onSelectedRowsChange={this.handleChange}
			/>
		);
	}
}

const Template = args => <ClassicComponentStory {...args} />;

export const ClassicComponent = Template.bind({});

ClassicComponent.args = {};

export default {
	title: 'Performance/Examples/Classic Component',
	component: ClassicComponent,
};
