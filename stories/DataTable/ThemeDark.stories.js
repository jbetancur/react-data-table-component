import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

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

const BuiltinStory = ({ theme }) => (
	<DataTable
		title="Movie List"
		columns={columns}
		data={data}
		theme={theme}
		highlightOnHover
		pointerOnHover
		pagination
		selectableRows
		expandableRows
	/>
);

const Template = args => <BuiltinStory {...args} />;

export const Builtin = Template.bind({});

Builtin.args = {
	theme: 'light',
};

export default {
	title: 'Theming/Builtin',
	component: Builtin,
	argTypes: {
		theme: {
			options: ['light', 'dark'],
			control: { type: 'radio' },
			description: 'toggle between light and dark themes',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'Hello' },
			},
		},
	},
};
