import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from '../../../src/index';

const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Director',
    selector: 'director',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
  },
];

const BasicHeaderWithNoData = () => (
  <DataTable
    title="Display Interactive Header When no Data"
    columns={columns}
    data={[]}
    persistTableHead
    forceEnableTableHeadRow
  />
);

storiesOf('General', module)
  .add('Persists Interactive Header When No Data', BasicHeaderWithNoData);
