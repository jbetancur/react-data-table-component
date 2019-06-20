import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { DataTableProvider, defaultState } from '../DataTableContext';
import { renderWithTheme } from '../../test-helpers';
import TableCol from '../TableCol';

afterEach(cleanup);

test('should render correctly with default props', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCol
        onColumnClick={jest.fn()}
        column={{ id: 1, name: 'test', selector: 'name' }}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly when the column is sortable and the sort is asc', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      sortDirection: 'asc',
      sortColumn: 'name',
    }}
    >
      <TableCol
        onColumnClick={jest.fn()}
        column={{ id: 1, name: 'test', selector: 'name', sortable: true }}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly when the column is sortable and the sort is desc', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      sortDirection: 'desc',
      sortColumn: 'name',
    }}
    >
      <TableCol
        onColumnClick={jest.fn()}
        column={{ id: 1, name: 'test', selector: 'name', sortable: true }}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly when the column is sortable and a custom sortIcon is passed', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      sortDirection: 'asc',
      sortColumn: 'name',
      sortIcon: <div>up</div>,
    }}
    >
      <TableCol
        onColumnClick={jest.fn()}
        column={{ id: 1, name: 'test', selector: 'name', sortable: true }}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});
