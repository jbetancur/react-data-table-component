import 'jest-styled-components';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

test('should render and empty table correctly', () => {
  const { container } = render(<DataTable data={[]} columns={[]} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render the correctly when using selector function', () => {
  const columns = [{ name: 'Name', selector: row => row.name }];
  const data = [{ id: 1, name: 'Leia' }];
  const { container } = render(<DataTable data={data} columns={columns} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render the correctly when using selector function and a format function', () => {
  const columns = [{ name: 'Name', selector: row => row.name, format: row => row.name.slice(0, 2) }];
  const data = [{ id: 1, name: 'Leia' }];
  const { container } = render(<DataTable data={data} columns={columns} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly if the keyField is overridden', () => {
  const mock = dataMock();
  const data = [{ uuid: 123, some: { name: 'Henry the 8th' } }];
  const { container } = render(<DataTable data={data} columns={mock.columns} keyField="uuid" />);

  expect(container.querySelector('div[id="row-123"]')).not.toBeNull();
});

test('should fallback to array indexes if data has no unique key', () => {
  const mock = dataMock();
  const data = [{ some: { name: 'Henry the 8th' } }];
  const { container } = render(<DataTable data={data} columns={mock.columns} />);

  expect(container.querySelector('div[id="row-0"]')).not.toBeNull();
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

test('should not show the TableHead when noTableHead is true', () => {
  const mock = dataMock();
  const { container } = render(
    <DataTable
      data={mock.data}
      columns={mock.columns}
      noTableHead
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

describe('DataTable::onSelectedRowsChange', () => {
  test('should call onSelectedRowsChange with the correct values when select all rows is selected', () => {
    const mock = dataMock();
    const updatedMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onSelectedRowsChange={updatedMock}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));

    expect(updatedMock).toBeCalledWith({
      allSelected: true,
      selectedCount: 2,
      selectedRows: mock.data,
    });
  });

  test('should call onSelectedRowsChange with the correct values when all rows are selected', () => {
    const mock = dataMock();
    const updatedMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onSelectedRowsChange={updatedMock}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-2"]'));
    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(updatedMock).toBeCalledWith({
      allSelected: true,
      selectedCount: 2,
      selectedRows: mock.data,
    });
  });

  test('should call onSelectedRowsChange with the correct values when a row is selected', () => {
    const mock = dataMock();
    const updatedMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        onSelectedRowsChange={updatedMock}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(updatedMock).toBeCalledWith({
      allSelected: false,
      selectedCount: 1,
      selectedRows: [mock.data[0]],
    });
  });
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

  test('should render correctly when column.sortable = true', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

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


  test('should render correctly when ignoreRowClick = true', () => {
    const mock = dataMock({ ignoreRowClick: true });
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

  test('should render correctly if column.hide sm', () => {
    const mock = dataMock({ hide: 'sm' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.hide md', () => {
    const mock = dataMock({ hide: 'md' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.hide lg', () => {
    const mock = dataMock({ hide: 'lg' });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.hide is an integer', () => {
    const mock = dataMock({ hide: 300 });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly if column.omit is true', () => {
    const mock = dataMock();
    const mockColumns = mock.columns.slice();
    mockColumns.push({ id: 2, name: 'HideMe', selector: 'some.name', omit: true });

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mockColumns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable:RowClicks', () => {
  test('should not call onRowClicked when ignoreRowClick = true', () => {
    const onRowClickedMock = jest.fn();
    const mock = dataMock({ ignoreRowClick: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onRowClicked={onRowClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="cell-1-1"]'));
    expect(onRowClickedMock).not.toBeCalled();
  });

  test('should not call onRowClicked when button = true', () => {
    const onRowClickedMock = jest.fn();
    const mock = dataMock({ button: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onRowClicked={onRowClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="cell-1-1"]'));
    expect(onRowClickedMock).not.toBeCalled();
  });

  test('should not call onRowDoubleClicked when ignoreRowClick = true', () => {
    const onRowDoubleClickedMock = jest.fn();
    const mock = dataMock({ ignoreRowClick: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onRowDoubleClicked={onRowDoubleClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="cell-1-1"]'));
    expect(onRowDoubleClickedMock).not.toBeCalled();
  });

  test('should not call onRowDoubleClicked when button = true', () => {
    const onRowDoubleClickedMock = jest.fn();
    const mock = dataMock({ button: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onRowDoubleClicked={onRowDoubleClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="cell-1-1"]'));
    expect(onRowDoubleClickedMock).not.toBeCalled();
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

  test('should only show Loading if progressPending prop changes', () => {
    const mock = dataMock();
    const { getByText, rerender, container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending={false}
      />,
    );

    rerender(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        progressPending
      />,
    );

    expect(getByText('Loading...')).toBeDefined();
    expect(container.querySelector('.rdt_TableHead')).toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('when persistTableHead', () => {
    test('should only Loading and TableHead if progressPending prop changes', () => {
      const mock = dataMock();
      const { getByText, rerender, container } = render(
        <DataTable
          data={mock.data}
          columns={mock.columns}
          defaultSortField="some.name"
          progressPending={false}
          persistTableHead
        />,
      );

      rerender(
        <DataTable
          data={mock.data}
          columns={mock.columns}
          defaultSortField="some.name"
          progressPending
          persistTableHead
        />,
      );

      expect(getByText('Loading...')).toBeDefined();
      expect(container.querySelector('.rdt_TableHead')).toBeDefined();
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should disable TableHead if no data', () => {
      const mock = dataMock();
      const { container } = render(
        <DataTable
          data={[]}
          columns={mock.columns}
          defaultSortField="some.name"
          persistTableHead
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('should disable TableHead if progressPending', () => {
      const mock = dataMock();
      const { container } = render(
        <DataTable
          data={[]}
          columns={mock.columns}
          defaultSortField="some.name"
          persistTableHead
          progressPending
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('when noTableHead', () => {
    test('should only Loading if progressPending prop changes', () => {
      const mock = dataMock();
      const { getByText, rerender, container } = render(
        <DataTable
          data={mock.data}
          columns={mock.columns}
          defaultSortField="some.name"
          progressPending={false}
          persistTableHead
          noTableHead
        />,
      );

      rerender(
        <DataTable
          data={mock.data}
          columns={mock.columns}
          defaultSortField="some.name"
          progressPending
          persistTableHead
          noTableHead
        />,
      );

      expect(getByText('Loading...')).toBeDefined();
      expect(container.querySelector('.rdt_TableHead')).toBeNull();
      expect(container.firstChild).toMatchSnapshot();
    });
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
  test('should not call onSort if the column is not sortable', () => {
    const onSortMock = jest.fn();
    const mock = dataMock({ sortable: false });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(onSortMock).not.toBeCalled();
  });

  test('should render correctly with a default sort field and the native sort icon', () => {
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

  test('should render correctly with a default sort field and the icon to the right when column.right = true and the native sort icon', () => {
    const mock = dataMock({ sortable: true, right: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly and not be sorted when a column.sort === false', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a column is sorted in default asc', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
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
      />,
    );

    // select the column to sort
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    // sort asc
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    // sort desc
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should sort if the column is selected and the Enter key is pressed', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    // select the column to sort
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    // press enter
    fireEvent.keyPress(container.querySelector('div[id="column-some.name"]'), { keyCode: 13 });

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

  test('should render correctly with a custom sortIcon and column.right = true', () => {
    const mock = dataMock({ sortable: true, right: true });
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

  test('should render correctly and bypass internal sort when sortServer = true and asc sort', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        sortServer
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    // note row order should not change, but sort arrows should
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly and bypass internal sort when sortServer = true and desc sort', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        sortServer
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    // note row order should not change, but sort arrows should
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
        expandableRows
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when expandableRowsHideExpander is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandableRowsHideExpander
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render expandableRows expandableRows is missing', () => {
    const mock = dataMock();
    mock.data[0].defaultExpanded = true;
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRowExpanded={row => row.defaultExpanded}
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
        expandableRows
      />,
    );

    fireEvent.click(getByTestId('expander-button-1'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when expandableRowExpanded is true', () => {
    const mock = dataMock();
    mock.data[0].defaultExpanded = true;
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandableRowExpanded={row => row.defaultExpanded}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when expandableRowExpanded changes on render', () => {
    const mock = dataMock();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandableRowExpanded={row => row.defaultExpanded}
      />,
    );

    // expand all rows
    const expandedData = mock.data.slice().map(i => ({ ...i, defaultExpanded: !i.defaultExpanded }));

    rerender(
      <DataTable
        data={expandedData}
        columns={mock.columns}
        selectableRows
        clearSelectedRows
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not expand a row if the expander row is disabled', () => {
    const mock = dataMock();
    mock.data[0].disabled = true;
    const { container, getByTestId } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandableRowDisabled={row => row.disabled}
      />,
    );
    fireEvent.click(getByTestId('expander-button-1'));

    expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
  });

  test('should not expand a row if expandableRows is false and expandOnRowClicked is true ', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandOnRowClicked
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
  });

  test('should expand a row if expandableRows is true and expandOnRowClicked is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandOnRowClicked
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not expand a row if expandableRows is false and expandOnRowDoubleClicked is true ', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandOnRowDoubleClicked
      />,
    );

    fireEvent.doubleClick(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
  });

  test('should expand a row if expandableRows is true and expandOnRowDoubleClicked is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandOnRowDoubleClicked
      />,
    );

    fireEvent.doubleClick(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not expand a row if the expander row is disabled and expandOnRowClicked is true', () => {
    const mock = dataMock();
    mock.data[0].disabled = true;
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandOnRowClicked
        expandableRowDisabled={row => row.disabled}
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
    expect(container.firstChild).toMatchSnapshot();
  });


  test('should call onRowExpandToggled with the correct values if a row is expanded', () => {
    const onRowExpandToggledMock = jest.fn();
    const mock = dataMock();
    const { getByTestId } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        onRowExpandToggled={onRowExpandToggledMock}
      />,
    );

    fireEvent.click(getByTestId('expander-button-1'));
    expect(onRowExpandToggledMock).toBeCalledWith(true, mock.data[0]);
  });

  test('should call onRowExpandToggled with the correct values if a row is collapsed', () => {
    const onRowExpandToggledMock = jest.fn();
    const mock = dataMock();
    const { getByTestId } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        onRowExpandToggled={onRowExpandToggledMock}
      />,
    );

    fireEvent.click(getByTestId('expander-button-1'));
    fireEvent.click(getByTestId('expander-button-1'));
    expect(onRowExpandToggledMock).toBeCalledWith(false, mock.data[0]);
  });

  test('should call onRowExpandToggled if expandOnRowClicked', () => {
    const onRowExpandToggledMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandOnRowClicked
        onRowExpandToggled={onRowExpandToggledMock}
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));
    expect(onRowExpandToggledMock).toBeCalled();
  });

  test('should call onRowExpandToggled if expandOnRowDoubleClicked', () => {
    const onRowExpandToggledMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        expandableRows
        expandOnRowDoubleClicked
        onRowExpandToggled={onRowExpandToggledMock}
      />,
    );

    fireEvent.doubleClick(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));
    expect(onRowExpandToggledMock).toBeCalled();
  });
});

describe('DataTable::selectableRows', () => {
  test('should render correctly when selectableRows is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when selectableRowsHighlight is true and a row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowsHighlight
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render a select all checkbox when selectableRowsNoSelectAll is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowsNoSelectAll
      />,
    );

    expect(container.querySelector('input[name="select-all-rows"]')).toBe(null);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('select-all-rows should be true is all rows are selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name=select-all-rows]'));

    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
  });

  test('select-all-rows should be false and not when all rows is de-selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name=select-all-rows]'));
    fireEvent.click(container.querySelector('input[name=select-all-rows]'));

    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(false);
  });

  test('should render correctly when selectableRows is true and a single row is checked', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(true);
    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(true);
  });

  test('select-all-rows should not be indeterminate when all rows are selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));
    fireEvent.click(container.querySelector('input[name="select-row-2"]'));

    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(false);
  });

  test('select-all-rows should be indeterminate when a single row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(true);
  });

  test('select-all-rows should be indeterminate when a row is selected ', () => {
    const mock = dataMock();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowSelected={row => row.selected}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(true);
  });

  test('should render correctly when selectableRows is true and a single row is un-checked', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));
    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(false);
  });

  test('select-all-rows should only check non disabled rows', () => {
    const mock = dataMock();
    mock.data[0].disabled = true;

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowDisabled={row => row.disabled}
      />,
    );

    fireEvent.click(container.querySelector('input[name=select-all-rows]'));

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(false);
    expect(container.querySelector('input[name="select-row-2"]').checked).toBe(true);
  });

  test('should not be checked if the selectableRow is disabled', () => {
    const mock = dataMock();
    mock.data[0].disabled = true;

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowDisabled={row => row.disabled}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));
    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(false);
  });

  test('select-all-rows should be disabled if all rows are disabled', () => {
    const mock = dataMock();
    mock.data[0].disabled = true;
    mock.data[1].disabled = true;

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowDisabled={row => row.disabled}
      />,
    );

    fireEvent.click(container.querySelector('input[name=select-all-rows]'));

    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(false);
    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(false);
    expect(container.querySelector('input[name="select-row-2"]').checked).toBe(false);
  });

  test('should be checked if a row is pre-selected and select-all-rows should indeterminate if not all rows are selected', () => {
    const mock = dataMock();
    mock.data[0].selected = true;

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowSelected={row => row.selected}
      />,
    );

    expect(container.querySelector('input[name="select-row-1"]').checked).toBe(true);
    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(true);
  });

  test('select-all-rows should be checked if the all rows are pre-selected but select-all-rows should not be indeterminate', () => {
    const mock = dataMock();
    mock.data[0].selected = true;
    mock.data[1].selected = true;

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        selectableRowSelected={row => row.selected}
      />,
    );

    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
    expect(container.querySelector('input[name="select-all-rows"]').indeterminate).toBe(false);
  });

  test('should render correctly when clearSelectedRows is toggled', () => {
    const mock = dataMock();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    rerender(
      <DataTable
        data={mock.data}
        columns={mock.columns}
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
        selectableRows
        onRowClicked={rowClickedMock}
      />,
    );

    fireEvent.click(container.querySelector('div[data-tag="___react-data-table-allow-propagation___"]'));

    expect(rowClickedMock.mock.calls[0][0]).toEqual(mock.data[0]);
    expect(rowClickedMock.mock.calls[0][1]).toBeDefined(); // TODO: mock event?
  });

  test('should render correctly when selectableRows, selectableRowsVisibleOnly and pagination', () => {
    const mock = dataMock({ sortable: true });
    const onSelectedRowsChange = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        selectableRowsVisibleOnly
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));

    // not ideal for testing but we can use the onSelectedRowsChange handler
    // to check that we only have 1 items selected (on page1) out of a total of 2
    expect(onSelectedRowsChange).toBeCalledWith({
      allSelected: true,
      selectedCount: 1,
      selectedRows: [{ id: 1, some: { name: 'Apple' } }],
    });
  });
});

describe('DataTable::Pagination', () => {
  test('should render correctly if pagination is enabled', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should have the correct amount of rows when paging forward', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(container.querySelector('div[id="row-1"]')).toBeNull();
    expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should have the correct amount of rows when paging backward', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationDefaultPage={2}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-previous-page'));
    expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
    expect(container.querySelector('div[id="row-2"]')).toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should have the correct amount of rows when paging to the last page', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-last-page'));
    expect(container.querySelector('div[id="row-1"]')).toBeNull();
    expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should have the correct amount of rows when paging backward to the first page', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationDefaultPage={2}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-first-page'));
    expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
    expect(container.querySelector('div[id="row-2"]')).toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should navigate to page 1 if the table is sorted', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(container.firstChild).toMatchSnapshot();
    expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
  });

  test('should recalculate pagination position if there is only 1 item and it is removed from the data', () => {
    const mock = dataMock();
    const mockOneDeleted = dataMock().data.slice(0, 1);
    const onChangePageMock = jest.fn();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    // move to last page
    fireEvent.click(container.querySelector('button#pagination-last-page'));

    rerender(
      <DataTable
        data={mockOneDeleted}
        columns={mock.columns}
        onChangePage={onChangePageMock}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(onChangePageMock).toBeCalledWith(1, 1);
  });

  test('should change the page position when using paginationServer if the last item is removed from a page', () => {
    const mock = dataMock();
    const mockOneDeleted = dataMock().data.slice(0, 1);
    const onChangePageMock = jest.fn();
    const onChangeRowsPerPageMock = jest.fn();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onChangePage={onChangePageMock}
        paginationPerPage={1}
        paginationTotalRows={2}
        paginationRowsPerPageOptions={[1, 2]}
        onChangeRowsPerPage={onChangeRowsPerPageMock}
        paginationServer
        pagination
      />,
    );

    // move to last page
    fireEvent.click(container.querySelector('button#pagination-last-page'));

    rerender(
      <DataTable
        data={mockOneDeleted}
        columns={mock.columns}
        onChangePage={onChangePageMock}
        paginationPerPage={1}
        paginationTotalRows={1}
        paginationRowsPerPageOptions={[1, 2]}
        onChangeRowsPerPage={onChangeRowsPerPageMock}
        paginationServer
        pagination
      />,
    );

    expect(container).toMatchSnapshot();
    expect(onChangePageMock).toBeCalledWith(1, 1);
  });

  test('should not change the page position when using paginationServer if there is only one page', () => {
    const mock = dataMock();
    const mockOneDeleted = dataMock().data.slice(0, 2);
    const onChangePageMock = jest.fn();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
        paginationServer
      />,
    );

    // move to last page
    fireEvent.click(container.querySelector('button#pagination-last-page'));

    rerender(
      <DataTable
        data={mockOneDeleted}
        columns={mock.columns}
        onChangePage={onChangePageMock}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        pagination
        paginationServer
      />,
    );

    expect(onChangePageMock).not.toBeCalled();
  });

  test('should call onChangePage with the correct values if paged forward', () => {
    const onChangePageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        onChangePage={onChangePageMock}
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).toBeCalledWith(2, 2);
  });

  test('should call onChangePage with the correct values if paged backward', () => {
    const onChangePageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        onChangePage={onChangePageMock}
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).toBeCalledWith(2, 2);
    fireEvent.click(container.querySelector('button#pagination-previous-page'));
    expect(onChangePageMock).toBeCalledWith(1, 2);
  });

  test('should not deselect all rows if using pagination and selectedRows', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
  });

  test('should deselect all rows if using paginationServer and selectedRows', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(false);
  });

  test('should call onSelectedRowsChange when changing the page if using paginationServer and selectedRows', () => {
    const mock = dataMock();
    const onSelectedRowsChange = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);
    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onSelectedRowsChange).toBeCalledTimes(2);
  });

  test('should not call onSelectedRowsChange when changing the page if using paginationServer, selectedRows, and persistSelectedOnPageChange', () => {
    const mock = dataMock();
    const onSelectedRowsChange = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnPageChange: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);
    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);
  });

  test('should not render a select all checkbox when persistSelectedOnPageChange is true', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnPageChange: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
      />,
    );

    expect(container.querySelector('input[name="select-all-rows"]')).toBe(null);
  });

  test('should call onSelectedRowsChange when sorting if using paginationServer and selectedRows', () => {
    const mock = dataMock({ sortable: true });
    const onSelectedRowsChange = jest.fn();
    const onSortMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
        pagination
        paginationServer
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalled();
    expect(onSelectedRowsChange).toBeCalledTimes(2);
  });

  test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and all rows checked', () => {
    const mock = dataMock({ sortable: true });
    const onSelectedRowsChange = jest.fn();
    const onSortMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnSort: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalled();
    expect(onSelectedRowsChange).toBeCalledTimes(1);
    expect(onSelectedRowsChange).toBeCalledWith({
      allSelected: true,
      selectedCount: 2,
      selectedRows: mock.data,
    });
  });

  test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and all rows un-checked', () => {
    const mock = dataMock({ sortable: true });
    const onSelectedRowsChange = jest.fn();
    const onSortMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnSort: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    // uncheck select all
    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalled();
    expect(onSelectedRowsChange).toBeCalledTimes(2);
    expect(onSelectedRowsChange).toBeCalledWith({
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
    });
  });

  test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and a single row is checked', () => {
    const mock = dataMock({ sortable: true });
    const onSelectedRowsChange = jest.fn();
    const onSortMock = jest.fn();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        onSort={onSortMock}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnSort: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSortMock).toBeCalled();
    expect(onSelectedRowsChange).toBeCalledTimes(1);
    expect(onSelectedRowsChange).toBeCalledWith({
      allSelected: false,
      selectedCount: 1,
      selectedRows: [{
        id: 1,
        some: {
          name: 'Apple',
        },
      }],
    });
  });

  test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and a row is preselected using selectableRowSelected', () => {
    const mock = dataMock();
    mock.data[0].selected = true;
    const onSelectedRowsChange = jest.fn();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationServerOptions={{ persistSelectedOnSort: true }}
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
        selectableRowSelected={row => row.selected}
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    );

    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(onSelectedRowsChange).toBeCalledTimes(1);
    expect(onSelectedRowsChange).toBeCalledWith({
      allSelected: false,
      selectedCount: 1,
      selectedRows: [{
        id: 1,
        selected: true,
        some: {
          name: 'Apple',
        },
      }],
    });
  });

  test('should deselect all rows if using pagination && paginationServer and selectedRows and the table is sorted', () => {
    const mock = dataMock({ sortable: true });
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
        paginationPerPage={1}
        paginationRowsPerPageOptions={[1, 2]}
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-all-rows"]'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(true);
    fireEvent.click(container.querySelector('div[id="column-some.name"]'));
    expect(container.querySelector('input[name="select-all-rows"]').checked).toBe(false);
  });

  test('should call onChangePage if paged with an the optional paginationTotalRows prop', () => {
    const onChangePageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
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
        pagination
        onChangeRowsPerPage={onChangeRowsPerPageMock}
      />,
    );

    fireEvent.change(container.querySelector('select'), { target: { value: 20 } });
    expect(onChangeRowsPerPageMock).toBeCalledWith(20, 1);
  });

  test('should call onChangeRowsPerPage if paged when paginationServer is true', () => {
    const onChangeRowsPerPageMock = jest.fn();
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationServer
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

  test('should render correctly when a paginationComponentOptions to hide the per page dropdown are passed', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationComponentOptions={{ noRowsPerPage: true }}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a paginationComponentOptions selectAllRowsItem is true', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationComponentOptions={{ selectAllRowsItem: true }}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a paginationComponentOptions selectAllRowsItem is true and selectAllRowsItemText is provided', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination
        paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'Todos' }}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when paginationResetDefaultPage is toggled', () => {
    const mock = dataMock();
    const { container, rerender } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1} // force 2 pages
        paginationRowsPerPageOptions={[1, 2]} // force 2 pages
        pagination
      />,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));

    rerender(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        paginationPerPage={1} // force 2 pages
        paginationRowsPerPageOptions={[1, 2]} // force 2 pages
        pagination
        paginationResetDefaultPage // this will toggle true and reset to page 1
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::subHeader', () => {
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

  test('should render header actions when they are provided', () => {
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

  test('should render the default context menu when using selectableRows', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render context menu actions when they are provided and a row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
        // eslint-disable-next-line react/jsx-one-expression-per-line
        contextActions={<><div>some action</div>, <div>some action 2</div></>}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a custom contextMessage object is provided', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
        contextMessage={{ singular: 'artículo', plural: 'artículos', message: 'seleccionada' }}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when a custom contextMessage object is provided without a message prop', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
        contextMessage={{ singular: 'artículo', plural: 'artículos' }}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not render a context menu when noContextMenu and a row is selected', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
        noContextMenu
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render a custom component within the context menu when contextComponent', () => {
    const mock = dataMock();
    // eslint-disable-next-line react/prop-types
    const CustomContext = ({ selectedCount }) => <div>{`Nice! You totally just selected ${selectedCount} sweet items!`}</div>;
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        title="whoa!"
        selectableRows
        // eslint-disable-next-line react/jsx-one-expression-per-line
        contextComponent={<CustomContext />}
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

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

describe('DataTable::dense', () => {
  test('should render correctly when dense', () => {
    const mock = dataMock();
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        dense
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::Theming', () => {
  test('should render correctly when rows spaced', () => {
    const mock = dataMock();
    const customStyles = {
      rows: {
        spacing: 'spaced',
      },
    };
    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        defaultSortField="some.name"
        customStyles={customStyles}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when rows spaced with spacingShadow', () => {
    const mock = dataMock();
    const customStyles = {
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
        customStyles={customStyles}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::conditionalRowStyles', () => {
  test('should render correctly when conditionalRowStyles are an empty array', () => {
    const mock = dataMock();
    mock.data[0].completed = true;
    const conditionalRowStyles = [];

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        conditionalRowStyles={conditionalRowStyles}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when conditionalRowStyles is defined and there is a match', () => {
    const mock = dataMock();
    mock.data[0].completed = true;
    const conditionalRowStyles = [
      {
        when: row => row.completed,
        style: {
          backgroundColor: 'rgba(63, 195, 128, 0.9)',
          color: 'white',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    ];

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        conditionalRowStyles={conditionalRowStyles}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when conditionalRowStyles is defined and there is no match', () => {
    const mock = dataMock();
    mock.data[0].completed = false;
    const conditionalRowStyles = [
      {
        when: row => row.completed,
        style: {
          backgroundColor: 'rgba(63, 195, 128, 0.9)',
          color: 'white',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    ];

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        conditionalRowStyles={conditionalRowStyles}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

test('should render correctly when conditionalRowStyles is used with an expandableRows an expandableInheritConditionalStyles', () => {
  const mock = dataMock();
  mock.data[0].completed = true;
  const conditionalRowStyles = [
    {
      when: row => row.completed,
      style: {
        backgroundColor: 'rgba(63, 195, 128, 0.9)',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const { container, getByTestId } = render(
    <DataTable
      data={mock.data}
      columns={mock.columns}
      conditionalRowStyles={conditionalRowStyles}
      expandableRows
      expandableInheritConditionalStyles
    />,
  );

  fireEvent.click(getByTestId('expander-button-1'));

  expect(container.firstChild).toMatchSnapshot();
});


describe('DataTable::column.style', () => {
  test('should render correctly when a style is set on a column', () => {
    const mock = dataMock();
    mock.columns[0].style = {
      backgroundColor: 'rgba(63, 195, 128, 0.9)',
    };

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::conditionalCellStyles', () => {
  test('should render correctly when conditionalCellStyles is defined and there is a match', () => {
    const mock = dataMock();
    mock.data[0].completed = true;
    mock.columns[0].conditionalCellStyles = [
      {
        when: row => row.completed,
        style: {
          backgroundColor: 'rgba(63, 195, 128, 0.9)',
        },
      },
    ];

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when conditionalCellStyles is defined and there is no match', () => {
    const mock = dataMock();
    mock.data[0].completed = false;
    mock.columns[0].conditionalCellStyles = [
      {
        when: row => row.completed,
        style: {
          backgroundColor: 'rgba(63, 195, 128, 0.9)',
        },
      },
    ];

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('DataTable::direction', () => {
  test('should render correctly when direction is auto', () => {
    const mock = dataMock();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination // pagination requires special handling for rtl cases
        direction="auto"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when direction is rtl', () => {
    const mock = dataMock();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination // pagination requires special handling for rtl cases
        direction="rtl"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when direction is ltr', () => {
    const mock = dataMock();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        pagination // pagination requires special handling for rtl cases
        direction="ltr"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render correctly when direction is rtl when using a context menu', () => {
    const mock = dataMock();

    const { container } = render(
      <DataTable
        data={mock.data}
        columns={mock.columns}
        selectableRows
        direction="rtl"
      />,
    );

    fireEvent.click(container.querySelector('input[name="select-row-1"]'));

    expect(container.firstChild).toMatchSnapshot();
  });
});
