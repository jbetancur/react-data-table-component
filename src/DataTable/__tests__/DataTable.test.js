import 'jest-styled-components';
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import DataTable from '../DataTable';

// eslint-disable-next-line arrow-body-style
jest.mock('shortid', () => {
  return {
    generate: jest.fn(() => 1),
  };
});

// eslint-disable-next-line arrow-body-style
const dataMock = colProps => {
  return {
    columns: [{ name: 'Test', selector: 'some.name', ...colProps }],
    data: [{ id: 1, some: { name: 'Apple' } }, { id: 2, some: { name: 'Zuchinni' } }],
  };
};

afterEach(cleanup);

test('should render and empty table correctly', () => {
  const { container } = render(<DataTable data={[]} columns={[]} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly if the keyField is overriden', () => {
  const mock = dataMock();
  const data = [{ uuid: 1, some: { name: 'Henry the 8th' } }];
  const { container } = render(<DataTable data={data} columns={mock.columns} keyField="uuid" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly when disabled', () => {
  const mock = dataMock();
  const { container } = render(
    <DataTable
      data={mock.data}
      columns={mock.columns}
      disabled
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

describe('data prop changes', () => {
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


describe('DataTable::columns', () => {
  test('should render correctly with columns/data', () => {
    const mock = dataMock();
    const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when column.wrap = true', () => {
    const mock = dataMock({ wrap: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when column.allowOverflow = true', () => {
    const mock = dataMock({ allowOverflow: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when column.compact = true', () => {
    const mock = dataMock({ compact: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when column.button = true', () => {
    const mock = dataMock({ button: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });


  test('should render correctly when column.cell is set to a component', () => {
    const mock = dataMock({ cell: row => <div>{row.some.name}</div> });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.right', () => {
    const mock = dataMock({ right: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.center', () => {
    const mock = dataMock({ center: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.minWidth', () => {
    const mock = dataMock({ minWidth: '200px' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.maxWidth', () => {
    const mock = dataMock({ maxWidth: '600px' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.width', () => {
    const mock = dataMock({ width: '200px' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::progress/nodata', () => {
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
      />,
    );

    expect(getByText('There are no records to display')).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a component is passed that is a string', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending
        progressComponent="A Component that is passed in"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a component is passed that is a react component', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending
        progressComponent={<div>A String that is passed in</div>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a component is passed that is a react component', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending
        progressCentered
        progressComponent={<div>A String that is passed in</div>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::responsive', () => {
  test('should render correctly responsive by default', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when responsive=false', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        responsive={false}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not apply overFlowY without an overflowYOffset or not responsive', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        responsive
        overflowY
        overflowYOffset="250px"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('DataTable::sorting', () => {
  test('should render correctly with a default sort field', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a column is sorted in default asc', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a column is sorted from asc to desc', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should call onSort with the correct params', () => {
    const onSortMock = jest.fn();
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(onSortMock).toBeCalledWith({ id: 1, ...mock.columns[0] }, 'asc');
  });

  test('should call onSort with the correct params if the sort is clicked twice', () => {
    const onSortMock = jest.fn();
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalledWith({ id: 1, ...mock.columns[0] }, 'asc');

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalledWith({ id: 1, ...mock.columns[0] }, 'desc');
  });

  test('should render correctly with a custom sortIcon', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        sortIcon={<div>ASC</div>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly with a defaultSortAsc = false', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        defaultSortAsc={false}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('DataTable::expandableRows', () => {
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

    fireEvent.click(getByTestId('expander-button-1'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when defaultExpandedField is true', () => {
    const mock = dataMock();
    mock.data[0].defaultExpanded = true;
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        defaultExpandedField="defaultExpanded"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::selectableRows', () => {
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

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(true);
  });

  test('should render correctly when clearSelectedRows is toggled', () => {
    const mock = dataMock();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    rerender(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        selectableRows
        clearSelectedRows
      />,
    );

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(false);
  });

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

describe('DataTable::Pagination', () => {
  test('should render correctly if pagination is enabled', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
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
        onRowClicked={jest.fn()}
        pagination
        onChangeRowsPerPage={onChangeRowsPerPageMock}
      />,
    );

    fireEvent.change(container.querySelector('select'), { target: { value: 20 } });
    expect(onChangeRowsPerPageMock).toBeCalledWith(20, 1);
  });

  test('should render correctly when a paginationComponentOptions are passed', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationComponentOptions={{ rowsPerPageText: 'Fila por página' }}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('DataTablke::subHeader', () => {
  test('should render correctly when a subheader is enabled', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subHeader
        subHeaderComponent={<div />}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });


  test('should render when subHeaderWrap is false', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subHeader
        subHeaderComponent={<div />}
        subHeaderWrap={false}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly with left align', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subHeader
        subHeaderComponent={<div />}
        subHeaderAlign="left"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly with center align', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subHeader
        subHeaderComponent={<div />}
        subHeaderAlign="center"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly with right align', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        subHeader
        subHeaderComponent={<div />}
        subHeaderAlign="right"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('DataTable::Header', () => {
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

  test('title should render correctly', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('contextTitle should render correctly', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        contextTitle="items!!!"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('actions should render correctly', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        // eslint-disable-next-line react/jsx-one-expression-per-line
        actions={<><div>some action</div>, <div>some action 2</div></>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('context menu should render correctly when selectableRows', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        // eslint-disable-next-line react/jsx-one-expression-per-line
        actions={<><div>some action</div>, <div>some action 2</div></>}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table--click-clip___"]'));

    expect(container.firstChild).toMatchSnapshot();
  });
});


describe('DataTable::fixedHeader', () => {
  test('should render correctly when fixedHeader', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        fixedHeader
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when fixedHeader and fixedHeaderScrollHeight', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        fixedHeader
        fixedHeaderScrollHeight="100px"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when fixedHeader with an offset', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        fixedHeader
        overflowY
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when fixedHeader with an offset with a value', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        fixedHeader
        overflowY
        offset="100px"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::striped', () => {
  test('should render correctly when striped', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        striped
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::highlightOnHover', () => {
  test('should render correctly when highlightOnHover', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        highlightOnHover
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::pointerOnHover', () => {
  test('should render correctly when pointerOnHover', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pointerOnHover
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::Theming', () => {
  test('should render correctly when rows spaced', () => {
    const mock = dataMock();
    const theme = {
      rows: {
        spacing: 'spaced',
      },
    };
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        expandableRows
        customTheme={theme}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when rows spaced with spacingShadow', () => {
    const mock = dataMock();
    const theme = {
      rows: {
        spacing: 'spaced',
        spacingShadow: '0',
      },
    };
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        expandableRows
        customTheme={theme}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
