import React from 'react';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

const Button = () => <button type="button">Download</button>;

// eslint-disable-next-line react/prop-types
const CustomTitle = ({ row }) => (
	<div>
		{/* eslint-disable-next-line react/prop-types */}
		<div>{row.title}</div>
		<div>
			<div
				data-tag="allowRowEvents"
				style={{ color: 'grey', overflow: 'hidden', whiteSpace: 'wrap', textOverflow: 'ellipses' }}
			>
				{/* eslint-disable-next-line react/prop-types */}
				{row.plot}
			</div>
		</div>
	</div>
);

const columns = [
	{
		name: 'Custom Title',
		selector: row => row.title,
		sortable: true,
		maxWidth: '600px', // when using custom you should use width or maxWidth, otherwise, the table will default to flex grow behavior
		cell: row => <CustomTitle row={row} />,
	},
	{
		name: 'Plot Format',
		selector: row => row.plot,
		wrap: true,
		sortable: true,
		format: row => `${row.plot.slice(0, 200)}...`,
	},
	{
		name: 'Genres',
		// eslint-disable-next-line react/no-array-index-key
		cell: row => (
			<div>
				{row.genres.map((genre, i) => (
					<div key={i}>{genre}</div>
				))}
			</div>
		),
	},
	{
		name: 'Thumbnail',
		grow: 0,
		cell: row => <img height="84px" width="56px" alt={row.name} src={row.posterUrl} />,
	},
	{
		name: 'Poster Link',
		button: true,
		cell: row => (
			<a href={row.posterUrl} target="_blank" rel="noopener noreferrer">
				Download
			</a>
		),
	},
	{
		name: 'Poster Button',
		button: true,
		cell: () => <Button>Download Poster</Button>,
	},
];

export const CustomCells = () => (
	<DataTable title="Movie List - Custom Cells" columns={columns} data={data} pagination />
);

export default {
	title: 'Columns/Cells/Custom Cells',
	component: CustomCells,
};
