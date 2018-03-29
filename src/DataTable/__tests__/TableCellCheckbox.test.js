import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import TableCellCheckbox from '../TableCellCheckbox';

test('component <TableCellCheckbox /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableCellCheckbox row={{}} column={{ selector: 'test' }} onClick={() => { }} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
