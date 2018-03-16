import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import NoData from '../NoData';

test('component <NoData /> should render correctly when a component is passed that is a string', () => {
  const wrapper = shallow(<NoData component="A Component that is passed in">A String that is passed in</NoData>);
  expect(wrapper).toMatchSnapshot();
});

test('component <NoData /> should render correctly when a component is passed that is a react component', () => {
  const wrapper = shallow(<NoData component={<div>A String that is passed in</div>}><div>A String that is passed in</div></NoData>);
  expect(wrapper).toMatchSnapshot();
});
