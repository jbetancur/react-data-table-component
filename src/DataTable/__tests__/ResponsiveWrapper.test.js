import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import ResponsiveWrapper from '../ResponsiveWrapper';

test('component <ResponsiveWrapper /> should render correctly', () => {
  const wrapper = shallow(<ResponsiveWrapper />);
  expect(wrapper).toMatchSnapshot();
});

test('component <ResponsiveWrapper responsive /> should render correctly ', () => {
  const wrapper = shallow(<ResponsiveWrapper responsive />);
  expect(wrapper).toMatchSnapshot();
});

test('component <ResponsiveWrapper overflowY /> should not apply overFlowY without an overflowYOffset or not responsive ', () => {
  const wrapper = shallow(<ResponsiveWrapper overflowY />);
  expect(wrapper).toMatchSnapshot();
});

test('component <ResponsiveWrapper responsive overflowY overflowYOffset="250px" /> should render correctly when overflowYOffset is provided ', () => {
  const wrapper = shallow(<ResponsiveWrapper responsive overflowY overflowYOffset="250px" />);
  expect(wrapper).toMatchSnapshot();
});
