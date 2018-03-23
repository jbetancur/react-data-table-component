import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import ExpanderButton from '../ExpanderButton';

test('component <ExpanderButton /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderButton data={{}} index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <ExpanderButton expanded /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderButton data={{}} index={0} expanded />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <ExpanderButton expanded={false} /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderButton data={{}} index={0} expanded={false} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <ExpanderButton onToggled /> with columns should render correctly', () => {
  const mockCallBack = jest.fn();
  const wrapper = shallowWithTheme(<ExpanderButton data={{}} index={0} onToggled={mockCallBack} />);
  wrapper.dive().dive().simulate('click');

  expect(mockCallBack).toHaveBeenCalled();
});
