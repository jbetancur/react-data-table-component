import React from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleDesserts';
import DataTable from '../../../src/index';

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    grow: 2,
  },
  {
    name: 'Type',
    selector: 'type',
    sortable: true,
  },
  {
    name: 'Calories (g)',
    selector: 'calories',
    sortable: true,
    right: true,
  },
  {
    name: 'Fat (g)',
    selector: 'fat',
    sortable: true,
    right: true,
  },
  {
    name: 'Carbs (g)',
    selector: 'carbs',
    sortable: true,
    right: true,
  },
  {
    name: 'Protein (g)',
    selector: 'protein',
    sortable: true,
    right: true,
  },
  {
    name: 'Sodium (mg)',
    selector: 'sodium',
    sortable: true,
    right: true,
  },
  {
    name: 'Calcium (%)',
    selector: 'calcium',
    sortable: true,
    right: true,
  },
  {
    name: 'Iron (%)',
    selector: 'iron',
    sortable: true,
    right: true,
  },
];

const conditionalRowStyles = [
  {
    when: row => row.calories < 300,
    style: {
      backgroundColor: 'rgba(63, 195, 128, 0.9)',
      color: 'white',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: row => row.calories >= 300 && row.calories < 400,
    style: {
      backgroundColor: 'rgba(248, 148, 6, 0.9)',
      color: 'white',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: row => row.calories >= 400,
    style: {
      backgroundColor: 'rgba(242, 38, 19, 0.9)',
      color: 'white',
      '&:hover': {
        cursor: 'not-allowed',
      },
    },
  },
];

const ConditionalRowStyle = () => (
  <DataTable
    title="Desserts - Conditional Rows"
    columns={columns}
    data={tableDataItems}
    conditionalRowStyles={conditionalRowStyles}
  />
);

storiesOf('Conditional Styling', module)
  .add('Conditional Rows', ConditionalRowStyle);
