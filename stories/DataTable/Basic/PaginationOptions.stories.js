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

const localization = {
	pagination: {
		rowsPerPageText: 'Filas por página',
		rangeSeparatorText: 'de',
	},
	selectableRows: {
		allRowsItemText: 'Todos',
	},
};

const options = {
	selectAllRowsItem: true,
	pagination: true,
};

const BasicTable = () => (
	<DataTable title="Lista de Peliculas" columns={columns} data={data} options={options} localization={localization} />
);

storiesOf('Pagination', module).add('Options', BasicTable);
