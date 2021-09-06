import React from 'react';
import doc from './options.mdx';
import data from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Título',
		selector: row => row.title,
		sortable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
	},
	{
		name: 'Año',
		selector: row => row.year,
		sortable: true,
	},
];

const paginationComponentOptions = {
	rowsPerPageText: 'Filas por página',
	rangeSeparatorText: 'de',
	selectAllRowsItem: true,
	selectAllRowsItemText: 'Todos',
};

export const Options = () => (
	<DataTable
		title="Lista de Peliculas"
		columns={columns}
		data={data}
		pagination
		paginationComponentOptions={paginationComponentOptions}
	/>
);

export default {
	title: 'Pagination/Options',
	component: Options,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
