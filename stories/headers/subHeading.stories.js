import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		reorder: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
		reorder: true,
	},
];

const headingRowStyle = {
	padding: '1rem',
	fontWeight: 'bold',
	flex: 1,
	textAlign: 'center',
};
const HeadingRow = () => <div style={headingRowStyle}>My Fixed Sub-Heading component</div>;

export const SubHeading = ({ fixedHeader, fixedHeaderScrollHeight }) => (
	<DataTable
		title="Movie List"
		columns={columns}
		data={data}
		fixedHeader={fixedHeader}
		fixedHeaderScrollHeight={fixedHeaderScrollHeight}
		subHeading={<HeadingRow />}
		pagination
	/>
);

export default {
	title: 'Headers/Sub Heading',
	component: SubHeading,
};
