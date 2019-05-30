import 'jest-styled-components';
import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
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
    data: [{ id: 1, some: { name: 'Henry the 8th' } }, { id: 2, some: { name: 'Henry the 9th' } }],
  };
};

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = render(<DataTable data={[]} columns={[]} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly with columns/data', () => {
  const mock = dataMock();
  const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly if the keyField is overriden', () => {
  const mock = dataMock();
  const data = [{ uuid: 1, some: { name: 'Henry the 8th' } }];
  const { container } = render(<DataTable data={data} columns={mock.columns} keyField="uuid" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render without a header if noHeader is true', () => {
  const mock = dataMock();
  const { container } = render(
    <DataTable
      data={mock.data}
      columns={mock.columns}
      noHeader
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

describe('prop changes', () => {
  test('should update state if the data prop changes', () => {
    const mock = dataMock();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    rerender(
      <DataTable
        data={[{ id: 1, some: { name: 'Someone else' } }]}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('progress/nodata', () => {
  test('should render correctly when progressPending is true', () => {
    const mock = dataMock();
    const { container, getByText } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending
      />,
    );

    expect(getByText('Loading...')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when progressPending is false and there are no row items', () => {
    const mock = dataMock();
    const { container, getByText } = render(
      <DataTable
        data={[]}
        columns={mock.columns}
        defaultSortField="some.name"
      />,
    );

    expect(getByText('There are no records to display')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('sorting', () => {
  test('should render correctly with a default sort field', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a column is sorted', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        expandableRows
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('expandableRows', () => {
  test('should render correctly when expandableRows is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        expandableRows
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when expandableRows is true and the row is toggled', () => {
    const mock = dataMock();
    const { container, getByTestId } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        expandableRows
      />,
    );

    fireEvent.click(getByTestId('expander-button'));

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('selectableRows', () => {
  test('should render correctly when selectableRows is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when selectableRows is true and all rows are selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name=select-all-rows]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when selectableRows is true and a single row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table--click-clip___"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when selectableRows is true and a single row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('onRowClicked', () => {
  test('should call onRowClicked is provided', () => {
    const rowClickedMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
        onRowClicked={rowClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table--click-clip___"]'));

    expect(rowClickedMock.mock.calls[0][0]).toEqual(mock.data[0]);
    expect(rowClickedMock.mock.calls[0][1]).toBeDefined(); // TODO: mock event?
  });
});

describe('Pagination', () => {
  test('should render correctly if pagination is enabled', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onRowClicked={jest.fn()}
        pagination
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should call onChangePage if paged', () => {
    const onChangePageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onRowClicked={jest.fn()}
        pagination
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        onChangePage={onChangePageMock}
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).toBeCalledWith(2, 2);
  });

  test('should call onChangePage if paged with an the optional paginationTotalRows prop', () => {
    const onChangePageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onRowClicked={jest.fn()}
        pagination
        paginationTotalRows={10}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        onChangePage={onChangePageMock}
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).toBeCalledWith(2, 10);
  });

  test('should call onChangeRowsPerPage if paged', () => {
    const onChangeRowsPerPageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onRowClicked={jest.fn()}
        pagination
        onChangeRowsPerPage={onChangeRowsPerPageMock}
      />,
    );

    fireEvent.change(container.querySelector('select'), { target: { value: 20 } });
    expect(onChangeRowsPerPageMock).toBeCalledWith(20, 1);
  });
});

describe('Subheader', () => {
  test('should render correctly when a subheader is enabled', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subheader
        subheaderComponent={<div />}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
