import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import DataTable from '../DataTable';

test('component <DataTable /> should render correctly', () => {
  const wrapper = shallow(<DataTable data={[]} columns={[]} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
