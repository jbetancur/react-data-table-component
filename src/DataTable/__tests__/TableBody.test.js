import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import TableBody from '../TableBody';

test('component <TableBody /> should render correctly', () => {
  const wrapper = shallow(<TableBody />);
  expect(wrapper).toMatchSnapshot();
});
