import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import DataTable from '../DataTable';

// eslint-disable-next-line arrow-body-style
jest.mock('shortid', () => {
  return {
    generate: jest.fn(() => 1),
  };
});

// eslint-disable-next-line arrow-body-style
const dataMock = () => {
  return {
    columns: [{ name: 'Test', selector: 'some.name' }],
    data: [{ id: 1, some: { name: 'Henry the 8th' } }],
  };
};

afterEach(cleanup);

test('component <DataTable /> should render correctly', () => {
  const { container } = render(<DataTable data={[]} columns={[]} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <DataTable /> should render correctly with columns/data', () => {
  const mock = dataMock();
  const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <DataTable /> should render correctly if the keyField is overriden', () => {
  const mock = dataMock();
  const data = [{ uuid: 1, some: { name: 'Henry the 8th' } }];
  const { container } = render(<DataTable data={data} columns={mock.columns} keyField="uuid" />);

  expect(container.firstChild).toMatchSnapshot();
});


test('component <DataTable /> should render correctly with a default sort field', () => {
  const mock = dataMock();
  const { container } = render(<DataTable
    data={mock.data}
    columns={mock.columns}
    defaultSortField="some.name"
  />);

  expect(container.firstChild).toMatchSnapshot();
});
