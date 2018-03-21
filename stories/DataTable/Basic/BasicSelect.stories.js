
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/arnoldQuotes';
import DataTable from '../../../src/DataTable/DataTable';

const columns = [
  {
    name: 'Quote',
    selector: 'quote',
    sortable: true,
  },
  {
    name: 'Movie',
    selector: 'movie',
    sortable: true,
  },
];

storiesOf('React Data Table', module).add('Basic Selectable', () => (
  <DataTable
    title="Arnie Quotes"
    columns={columns}
    data={data}
    selectableRows
  />
));
