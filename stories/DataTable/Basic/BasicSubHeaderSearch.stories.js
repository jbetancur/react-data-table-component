
import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/DataTable/DataTable';

const TextField = styled.input`
  height: 32px;
  width: 300px;
  border-radius: 3px;
  border: 1px solid #e5e5e5;
  padding: 16px;

  &:hover {
    cursor: pointer;
  }
`;

// eslint-disable-next-line react/prop-types
const Filter = ({ onFilter }) => (
  <TextField id="search" type="search" role="search" placeholder="Search Title" onChange={e => onFilter(e.target.value)} />
);

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
  const [filterText, setFilterText] = React.useState('');
  const filteredItems = data.filter(item => item.title.includes(filterText));

  return (
    <DataTable
      title="Movie List"
      columns={columns}
      data={filteredItems}
      subHeader
      subHeaderComponent={<Filter onFilter={value => setFilterText(value)} />}
    />
  );
};

storiesOf('Basic', module)
  .add('Filter/Search', () => <BasicTable />);
