
import React from 'react';
import { storiesOf } from '@storybook/react';
import moment from 'moment';
import data from '../constants/sampleRMEpisodes';
import DataTable from '../../../src/DataTable/DataTable';
import SampleExpandedComponent from './RickExpandedComponent';
import { trim } from '../demo-utils';

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: d => <div><div style={{ fontWeight: 700 }}>{d.name}</div>{trim(d.summary, 100)}</div>,
    width: '100px',
  },
  {
    name: 'Season',
    selector: 'season',
    sortable: true,
  },
  {
    name: 'Air Date',
    selector: 'airstamp',
    sortable: true,
    format: d => moment(d.airstamp).format('ll'),
  },
  {
    name: 'Image',
    selector: 'image.medium',
    cell: d => <img height="42px" width="80px" alt={d.image.medium} src={d.image.medium} />,
  },
];

storiesOf('React Data Table', module).add('Expansion & Custom Cells', () => (
  <DataTable
    title="Rick & Morty Episodes"
    columns={columns}
    data={data}
    expandableRows
    highlightOnHover
    defaultSortField="name"
    defaultSortDirection="desc"
    expandableRowsComponent={<SampleExpandedComponent />}
  />
));
