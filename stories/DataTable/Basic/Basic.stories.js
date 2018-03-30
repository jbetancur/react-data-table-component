
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
    right: true,
  },
];

storiesOf('Basic', module).add('Basic', () => (
  <DataTable
    title="Arnie Movies"
    columns={columns}
    data={data}
  />
));
