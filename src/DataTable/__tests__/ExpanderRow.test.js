import 'jest-styled-components';

import React from 'react';
import ExpanderRow from '../ExpanderRow';
import { shallowWithTheme } from '../../test-helpers';

test('component <ExpanderRow /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderRow />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <ExpanderRow numColumns /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderRow numColumns={5} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <ExpanderRow /> with children should render correctly and have a data prop', () => {
  const wrapper = shallowWithTheme(<ExpanderRow data={{ name: 'morty' }}><div>Some Expander Content</div></ExpanderRow>);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
