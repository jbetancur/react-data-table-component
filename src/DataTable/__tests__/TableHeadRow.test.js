import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';
import TableHeadRow from '../TableHeadRow';

test('component <TableHeadRow /> should render correctly', () => {
  const wrapper = shallow(<TableHeadRow />);
  expect(wrapper).toMatchSnapshot();
});
