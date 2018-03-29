import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableCell from '../TableCell';

test('component <TableCell /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableCell row={{}} column={{ selector: 'test' }} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
