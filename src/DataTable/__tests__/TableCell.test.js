import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import { DataTableProvider, defaultState } from '../DataTableContext';
import TableCell from '../TableCell';

const columnMock = {
  id: 123,
  name: 'Name',
  selector: 'name',
};

const rowMock = {
  id: 456,
  name: 'testname',
};

afterEach(cleanup);

test('<TableCell /> should render correctly with defaults', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={columnMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if not an internal cell (e.g. checkbox or expander', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      internalCell: true,
    }}
    >
      <TableCell row={rowMock} column={columnMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.button', () => {
  const buttonColMock = { ...columnMock, ...{ button: true } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.wrap', () => {
  const buttonColMock = { ...columnMock, ...{ wrap: true } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.allowOverflow', () => {
  const buttonColMock = { ...columnMock, ...{ allowOverflow: true } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.right', () => {
  const buttonColMock = { ...columnMock, ...{ right: true } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.center', () => {
  const buttonColMock = { ...columnMock, ...{ center: true } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.minWidth', () => {
  const buttonColMock = { ...columnMock, ...{ minWidth: '200px' } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.maxWidth', () => {
  const buttonColMock = { ...columnMock, ...{ maxWidth: '200px' } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableCell /> should render correctly if column.width', () => {
  const buttonColMock = { ...columnMock, ...{ width: '200px' } };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCell row={rowMock} column={buttonColMock} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});
