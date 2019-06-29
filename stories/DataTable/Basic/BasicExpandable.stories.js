
import React from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleMovieData';
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

// eslint-disable-next-line react/prop-types
const ExpandedSection = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const BasicTable = () => (
  <DataTable
    title="Movie List"
    columns={columns}
    data={tableDataItems}
    expandableRows
    highlightOnHover
    defaultSortField="name"
    defaultSortDirection="desc"
    expandableRowsComponent={<ExpandedSection />}
  />
);

const BasicTableExpanderDisabled = () => {
  const data = tableDataItems.map(item => {
    let expandable = true;
    if (Number(item.year) >= 2000) {
      expandable = false;
    }
    return { ...item, expandable };
  });
  return (
    <DataTable
      title="Movie List - No additional info for old movies (Before 2000)"
      columns={columns}
      data={data}
      expandableRows
      expanderDisabledField="expandable"
      highlightOnHover
      defaultSortField="name"
      defaultSortDirection="desc"
      expandableRowsComponent={<ExpandedSection />}
    />
  );
};


storiesOf('Basic', module)
  .add('Expandable', BasicTable)
  .add('Expander disabled by row', BasicTableExpanderDisabled);
