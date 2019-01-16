import 'jest-styled-components';
import React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import { DataTableProvider, defaultState } from '../DataTableContext';
import TableRow from '../TableRow';

const columnsMock = [{
  id: 123,
  name: 'Name',
  selector: 'name',
}];

const rowMock = {
  id: 456,
  name: 'testname',
};

afterEach(cleanup);

test('should render correctly with no columns', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{ columns: [] }}>
      <TableRow
        row={rowMock}

        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly with striped prop', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [],
      rows: [rowMock],
    }}
    >
      <TableRow
        striped
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly with highlightOnHover prop', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [],
      rows: [rowMock],
    }}
    >
      <TableRow
        highlightOnHover
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly with pointerOnHover prop', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [],
      rows: [rowMock],
    }}
    >
      <TableRow
        pointerOnHover
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});


test('with children should render correctly', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{ columns: columnsMock }}>
      <TableRow
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      >
        <td>Some Child Cell</td>
      </TableRow>
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('with columns should render correctly if a row does not have a keyField', () => {
  const row = { name: 'testname' };
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{ columns: columnsMock }}>
      <TableRow
        row={row}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('with columns should render correctly if a row has a keyField', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{ ...defaultState, columns: columnsMock }}>
      <TableRow
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('with columns should render correctly if selectableRows is true', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [],
      rows: [rowMock],
      selectableRows: true,
    }}
    >
      <TableRow
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('with columns should render correctly if selectableRows is true and a row is checked', () => {
  const rowSelctedMock = jest.fn();
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [rowMock],
      rows: [rowMock],
      selectableRows: true,
    }}
    >
      <TableRow
        row={rowMock}
        onRowClicked={jest.fn()}
        onRowSelected={rowSelctedMock}
      />
    </DataTableProvider>,
  );

  fireEvent.click(container.querySelector('input[type=checkbox]'));

  expect(rowSelctedMock).toBeCalled();
  expect(container.firstChild).toMatchSnapshot();
});

test('with columns should render correctly if expandableRows', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      rows: [rowMock],
      expandableRows: true,
    }}
    >
      <TableRow
        row={rowMock}
        // ...
        onRowClicked={jest.fn()}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('onRowClicked should be called when the row is clicked', () => {
  const rowClickMock = jest.fn();
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectedRows: [],
      rows: [rowMock],
    }}
    >
      <TableRow
        row={rowMock}
        onRowClicked={rowClickMock}
        onRowSelected={jest.fn()}
      />
    </DataTableProvider>,
  );

  fireEvent.click(container.querySelector('div[data-tag="___react-data-table--click-clip___"]'));

  expect(rowClickMock).toBeCalled();
});

describe('when column.ignoreRowClick is true', () => {
  const columnsMockIgnoreClick = [{
    id: 123,
    name: 'Name',
    selector: 'name',
    ignoreRowClick: true,
  }];

  test('should not render the click clip div', () => {
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{
        ...defaultState,
        columns: columnsMockIgnoreClick,
        selectedRows: [],
        rows: [rowMock],
      }}
      >
        <TableRow
          row={rowMock}
          onRowClicked={jest.fn()}
          onRowSelected={jest.fn()}
        />
      </DataTableProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('onRowClicked should be not be called if the row is clicked', () => {
    const rowClickMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{
        ...defaultState,
        columns: columnsMockIgnoreClick,
        selectedRows: [],
        rows: [rowMock],
      }}
      >
        <TableRow
          row={rowMock}
          onRowClicked={rowClickMock}
          onRowSelected={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.firstChild);

    expect(rowClickMock).not.toBeCalled();
  });
});
