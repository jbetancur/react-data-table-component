import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableCellExpander from '../TableCellExpander';

test('component <TableCellExpander /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableCellExpander row={{}} column={{ selector: 'test' }} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
