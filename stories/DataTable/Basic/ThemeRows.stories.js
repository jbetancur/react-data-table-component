
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const rowTheme = {
  header: {
    borderColor: 'transparent',
  },
  rows: {
    // spaced allows the following properties
    spacing: 'spaced',
    spacingBorderRadius: '50px',
    spacingMargin: '3px',

    borderColor: 'rgba(0,0,0,.12)',
    backgroundColor: 'white',
    height: '52px',
  },
  cells: {
    cellPadding: '48px',
  },
  footer: {
    separatorStyle: 'none',
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

const ThemedTable = () => (
  <DataTable
    title="Movie List"
    columns={columns}
    data={data}
    customTheme={rowTheme}
    pointerOnHover
    pagination
  />
);

storiesOf('Theming', module)
  .add('Custom Rows', ThemedTable);
