import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableCell from '../TableCell';

test('component <TableCell /> should render correctly', () => {
  const onClick = jest.fn();
  const wrapper = shallowWithTheme(<TableCell row={{}} column={{ selector: 'test' }} onClick={onClick} />);
  wrapper.simulate('click');

  expect(onClick).toHaveBeenCalled();
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableCell /> should render correctly and prevent clicks when column.ignoreRowClick = true', () => {
  const onClick = jest.fn();
  const wrapper = shallowWithTheme(<TableCell row={{}} column={{ selector: 'test', ignoreRowClick: true }} onClick={onClick} />);

  expect(onClick).not.toHaveBeenCalled();
  expect(wrapper.dive().dive()).toMatchSnapshot();
});
