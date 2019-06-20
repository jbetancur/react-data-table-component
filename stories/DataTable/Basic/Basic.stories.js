
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

const BasicTable = () => {
  // eslint-disable-next-line no-console
  const handleSort = (column, sortDirection) => console.log(column.selector, sortDirection);

  return (
    <DataTable
      title="Movie List"
      columns={columns}
      data={data}
      onSort={handleSort}
    />
  );
};


storiesOf('Basic', module)
  .add('Sortable', BasicTable);
