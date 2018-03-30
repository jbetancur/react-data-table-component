import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';
import TableRow from '../TableRow';

const columnsMock = [{
  id: 123,
  name: 'Name',
  selector: 'name',
}];

const rowMock = { id: 456, name: 'testname' };

const baseProps = {
  columns: columnsMock,
  row: rowMock,
  keyField: 'id',
  index: 0,
  striped: false,
  highlightOnHover: false,
  pointerOnHover: false,
  onRowClicked: () => {},
  onRowSelected: () => {},
  selectedRows: [],
  rows: [],
  checkboxComponent: 'input',
  checkboxComponentOptions: {},
  selectableRows: false,
  expandableRows: false,
  onToggled: () => { },
  firstCellIndex: 0,
};

test('component <TableRow /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow striped /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow striped {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow highlightOnHover /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow highlightOnHover {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow pointerOnHover /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow pointerOnHover {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});


test('component <TableRow /> with children should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow {...baseProps}><td>Some Child Cell</td></TableRow>);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row does not have a keyField', () => {
  const columns = [{
    id: 123,
    name: 'Name',
    selector: 'name',
  }];
  const row = { name: 'testname' };
  const wrapper = shallowWithTheme(<TableRow columns={columns} row={row} {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row has a keyField', () => {
  const wrapper = shallowWithTheme(<TableRow {...baseProps} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

// test('component <TableRow onRowClicked /> with columns should render correctly', () => {
//   const mockCallBack = jest.fn();
//   const wrapper = shallowWithTheme(<TableRow selectableRows onRowClicked={mockCallBack} {...baseProps} />);
//   wrapper.dive().dive().simulate('click');

//   expect(mockCallBack).toHaveBeenCalled();
// });
