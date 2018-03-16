import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import Table from '../Table';

test('component <Table /> should render correctly', () => {
  const wrapper = shallow(<Table />);
  expect(wrapper).toMatchSnapshot();
});

test('component <Table disabled={true} /> should render correctly ', () => {
  const wrapper = shallow(<Table disabled />);
  expect(wrapper).toMatchSnapshot();
});
