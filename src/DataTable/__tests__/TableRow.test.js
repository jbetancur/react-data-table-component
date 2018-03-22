import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableRow from '../TableRow';

test('component <TableRow /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow columns={[]} row={{}} keyField="id" index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow striped /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow striped columns={[]} row={{}} keyField="id" index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow highlightOnHover /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow highlightOnHover columns={[]} row={{}} keyField="id" index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with children should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow columns={[]} row={{}} keyField="id" index={0}><td>Some Child Cell</td></TableRow>);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row does not have a keyField', () => {
  const columns = [{
    id: 123,
    name: 'Name',
    selector: 'name',
  }];
  const row = { name: 'testname' };
  const wrapper = shallowWithTheme(<TableRow columns={columns} row={row} keyField="id" index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with columns should render correctly if a row has a keyField', () => {
  const columns = [{
    id: 123,
    name: 'Name',
    selector: 'name',
  }];
  const row = { id: 456, name: 'testname' };
  const wrapper = shallowWithTheme(<TableRow columns={columns} row={row} keyField="id" index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
