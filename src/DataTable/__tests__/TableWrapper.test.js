import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import TableWrapper from '../TableWrapper';

test('component <TableWrapper /> should render correctly', () => {
  const wrapper = shallow(<TableWrapper />);
  expect(wrapper).toMatchSnapshot();
});
