import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableRow from '../TableRow';

const columnsMock = [{
  id: 123,
  name: 'Name',
  selector: 'name',
}];

// eslint-disable-next-line arrow-body-style
jest.doMock('../DataTableContext', () => {
  return {
    DataTableContext: {
      Consumer: props => props.children({
        columns: columnsMock,
      }),
    },
  };
});

const rowMock = { id: 456, name: 'testname' };

afterEach(cleanup);

test('component <TableRow /> should render correctly', () => {
  const { container } = renderWithTheme(
    <TableRow
      row={rowMock}
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('component <TableRow striped /> should render correctly', () => {
  const { container } = renderWithTheme(
    <TableRow
      striped
      // ...
      row={rowMock}
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('component <TableRow highlightOnHover /> should render correctly', () => {
  const { container } = renderWithTheme(
    <TableRow
      highlightOnHover
      // ...
      row={rowMock}
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('component <TableRow pointerOnHover /> should render correctly', () => {
  const { container } = renderWithTheme(
    <TableRow
      pointerOnHover
      // ...
      row={rowMock}
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});


test('component <TableRow /> with children should render correctly', () => {
  const { container } = renderWithTheme(
    <TableRow
      row={rowMock}
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    >
      <td>Some Child Cell</td>
    </TableRow>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row does not have a keyField', () => {
  const row = { name: 'testname' };
  const { container } = renderWithTheme(
    <TableRow
      row={row}
      // ...
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row has a keyField', () => {
  const { container } = renderWithTheme(
    <TableRow
      row={rowMock}
      // ...
      index={0}
      onToggled={jest.fn()}
      onRowClicked={jest.fn()}
      onRowSelected={jest.fn()}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});
