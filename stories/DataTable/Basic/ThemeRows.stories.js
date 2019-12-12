
import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const customTheme = {
  headRow: {
    style: {
      border: 'none',
    },
  },
  rows: {
    style: {
      marginTop: '6px',
      marginBottom: '6px',
      minHeight: '52px',
      borderRadius: '2px',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgba(0,0,0,.12)',
      boxShadow: '0 1px 5px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.12)',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
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
    customTheme={customTheme}
    pointerOnHover
    pagination
    selectableRows
    expandableRows
  />
);

storiesOf('Theming', module)
  .add('Custom Theme', ThemedTable);
