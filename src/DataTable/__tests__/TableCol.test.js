import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableCol from '../TableCol';

test('component <TableCol /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableCol />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
