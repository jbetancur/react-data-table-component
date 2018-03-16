import 'jest-styled-components';

import React from 'react';
import { shallow } from 'enzyme';

import ProgressWrapper from '../ProgressWrapper';

test('component <ProgressWrapper component /> should render correctly when a component is passed that is a string', () => {
  const wrapper = shallow(<ProgressWrapper component="A Component that is passed in">A String that is passed in</ProgressWrapper>);

  expect(wrapper.dive()).toMatchSnapshot();
});

test('component <ProgressWrapper component /> should render correctly when a component is passed that is a react component', () => {
  const wrapper = shallow(<ProgressWrapper component={<div>A String that is passed in</div>}><div>A String that is passed in</div></ProgressWrapper>);

  expect(wrapper.dive()).toMatchSnapshot();
});

test('component <ProgressWrapper centered /> should render correctly when a component is passed that is a react component', () => {
  const wrapper = shallow(<ProgressWrapper centered component="A Component that is passed in" />);

  expect(wrapper.dive()).toMatchSnapshot();
});
