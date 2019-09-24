
import React from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleMovieData';
import DataTable from '../../../src/index';
import ExpandedComponent from '../shared/ExpandedComponent';

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
    name: 'Genres',
    selector: 'genres',
    // eslint-disable-next-line react/no-array-index-key
    cell: row => row.genres.map((genre, i) => <div key={i}>{genre}</div>),
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
  },
];

const BasicTableExpanderDisabled = () => {
  const data = tableDataItems.map(item => {
    let expanderDisabled = false;
    if (Number(item.year) < 2000) {
      expanderDisabled = true;
    }
    return { ...item, expanderDisabled };
  });
  return (
    <DataTable
      title="Movie List - No additional info for old movies (Before 2000)"
      columns={columns}
      data={data}
      expandableRows
      expandableDisabledField="expanderDisabled"
      highlightOnHover
      defaultSortField="name"

      expandableRowsComponent={<ExpandedComponent />}
    />
  );
};

storiesOf('Expandable', module)
  .add('Disable Expanded Row', BasicTableExpanderDisabled);
