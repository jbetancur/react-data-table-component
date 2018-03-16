
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/DataTable/DataTable';

const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    number: true,
  },
];

storiesOf('React Data Table', module).add('Basic', () => (
  <DataTable
    title="Arnie Movies"
    columns={columns}
    data={data}
  />
));
