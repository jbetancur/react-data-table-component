import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/DataTable/DataTable';

const Button = styled.button`
  height: 32px;
  width: 32px;
  outline: none;
  border-radius: 2px;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 0;
  user-select: none;
  margin-left: 5px;

  &:hover {
    cursor: pointer;
  }
`;

const TextField = styled.input`
  height: 32px;
  outline: none;
  width: 200px;
  border-radius: 3px;
  border: 1px solid #e5e5e5;
  padding: 3px;

  &:hover {
    cursor: pointer;
  }
`;

const SubActions = () => (
  <React.Fragment>
    <TextField id="search" type="text" placeholder="Search" />
    <Button><i className="material-icons">search</i></Button>
    <Button><i className="material-icons">play_arrow</i></Button>
    <Button><i className="material-icons">pause</i></Button>
    <Button><i className="material-icons">stop</i></Button>
    <Button><i className="material-icons">fast_rewind</i></Button>
    <Button><i className="material-icons">fast_forward</i></Button>
    <Button><i className="material-icons">loop</i></Button>
    <Button><i className="material-icons">mic</i></Button>
    <Button><i className="material-icons">volume_up</i></Button>
    <Button><i className="material-icons">volume_down</i></Button>
    <Button><i className="material-icons">volume_mute</i></Button>
  </React.Fragment>
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

const BasicTable = () => (
  <DataTable
    title="Movie List"
    columns={columns}
    data={data}
    subHeader
    subHeaderComponent={<SubActions />}
  />
);

storiesOf('Basic', module)
  .add('Subheader', BasicTable);
