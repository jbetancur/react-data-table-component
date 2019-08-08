import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleChocolates';
import DataTable from '../../../src/DataTable/DataTable';

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Manufacturer',
    selector: 'manufacturer',
    sortable: true,
  },
  {
    name: 'Country',
    selector: 'country',
    sortable: true,
  },
  {
    name: 'Type',
    selector: 'type',
    sortable: true,
  },
  {
    name: 'Calories',
    selector: 'calories',
    sortable: true,
  },
  {
    name: 'Protein',
    selector: 'protein',
    sortable: true,
  },
  {
    name: 'Out of Stock',
    selector: 'isOutOfStock',
    sortable: true,
    cell: row => <div>{row.isOutOfStock ? 'Yes' : 'No'}</div>,
  },
];

const BasicSelectDisabledRow = () => (
  <DataTable
    title="Chocolates"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsDisabledField="isOutOfStock"
  />
);

storiesOf('Basic', module).add(
  'Selectable: Disable Selection',
  BasicSelectDisabledRow,
);
