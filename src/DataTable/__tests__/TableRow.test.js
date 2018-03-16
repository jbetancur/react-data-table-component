import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableRow from '../TableRow';

test('component <TableRow /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow striped /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow striped />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow highlightOnHover /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow highlightOnHover />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableRow /> with children should render correctly', () => {
  const wrapper = shallowWithTheme(<TableRow><td>Some Child Cell</td></TableRow>);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

