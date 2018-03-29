import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableColCheckbox from '../TableColCheckbox';

test('component <TableColCheckbox /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableColCheckbox row={{}} column={{ selector: 'test' }} onClick={() => { }} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
