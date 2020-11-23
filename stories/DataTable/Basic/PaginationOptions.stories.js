import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Título',
		selector: 'title',
		sortable: true,
	},
	{
		name: 'Director',
		selector: 'director',
		sortable: true,
	},
	{
		name: 'Año',
		selector: 'year',
		sortable: true,
	},
];

const paginationOptions = {
	rowsPerPageText: 'Filas por página',
	rangeSeparatorText: 'de',
	selectAllRowsItem: true,
	selectAllRowsItemText: 'Todos',
};

const BasicTable = () => (
	<DataTable
		title="Lista de Peliculas"
		columns={columns}
		data={data}
		pagination
		paginationComponentOptions={paginationOptions}
	/>
);

storiesOf('Pagination', module).add('Options', BasicTable);
