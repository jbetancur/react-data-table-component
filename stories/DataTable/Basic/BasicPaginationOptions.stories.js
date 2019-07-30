
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/DataTable/DataTable';

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

const paginationOptions = { rowsPerPageText: 'Filas por página', rangeSeparatorText: 'de' };

const BasicTable = () => (
  <DataTable
    title="Lista de Peliculas"
    columns={columns}
    data={data}
    pagination
    paginationComponentOptions={paginationOptions}
  />
);


storiesOf('Basic', module)
  .add('Pagination: Options', BasicTable);
