
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/DataTable/DataTable';

const darkTheme = {
  rows: {
    // spaced allows the following properties
    spacing: 'spaced',
    spacingBorderRadius: 0,
    spacingMargin: '3px',
    spacingShadow: '0 1px 3px 0 rgba(0,0,0,0.15)',

    borderColor: 'transparent',
    backgroundColor: 'white',
    height: '64px',
  },
  cells: {
    cellPadding: '48px',
  },
};

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

const BasicTable = () => (
  <DataTable
    title="Movie List"
    columns={columns}
    data={data}
    customTheme={darkTheme}
    highlightOnHover
    pointerOnHover
    pagination
  />
);


storiesOf('Custom Theme', module)
  .add('Custom Rows', BasicTable);
