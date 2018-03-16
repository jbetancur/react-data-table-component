import 'jest-styled-components';

import React from 'react';
import TableHead from '../TableHead';
import { shallowWithTheme } from '../../test-helpers';

test('component <TableHead /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHead />);
  expect(wrapper.dive()).toMatchSnapshot();
});
