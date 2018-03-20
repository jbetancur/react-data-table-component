import 'jest-styled-components';

import React from 'react';
import { shallowWithTheme } from '../../test-helpers';

import ExpanderButton from '../ExpanderButton';

test('component <ExpanderButton /> should render correctly', () => {
  const wrapper = shallowWithTheme(<ExpanderButton data={{}} index={0} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
