
import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import faker from 'faker';
import DataTable from '../../../src/index';

const createUser = () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  address: faker.address.streetAddress(),
  bio: faker.lorem.sentence(),
  image: faker.image.avatar(),
});

const createUsers = (numUsers = 5) =>
  new Array(numUsers).fill(undefined).map(createUser);

const fakeUsers = createUsers(2000);

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
    name: 'Name',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
  },
  {
    name: 'Address',
    selector: 'address',
    sortable: true,
  },
];

const BasicTable = () => {
  const [filterText, setFilterText] = React.useState('');
  const filteredItems = fakeUsers.filter(item => item.name && item.name.includes(filterText));

  const subHeaderComponentMemo = React.useMemo(() => <Filter onFilter={value => setFilterText(value)} />, []);

  return (
    <DataTable
      title="Contact List"
      columns={columns}
      data={filteredItems}
      pagination
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
    />
  );
};

storiesOf('Filtering', module)
  .add('Using SubHeader', () => <BasicTable />);
