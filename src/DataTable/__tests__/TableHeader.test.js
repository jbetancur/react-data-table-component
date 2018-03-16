import 'jest-styled-components';

import React from 'react';
import TableHeader from '../TableHeader';
import { shallowWithTheme, mountWithTheme } from '../../test-helpers';

test('component <TableHeader title /> should render correctly', () => {
  const wrapper = mountWithTheme(<TableHeader title="whoa!" />);

  expect(wrapper).toMatchSnapshot();
});

test('component <TableHeader title showContextMenu /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHeader title="whoa!" showContextMenu />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableHeader title contextTitle /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHeader title="whoa!" contextTitle="items!!!" />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableHeader title contextActions /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHeader title="whoa!" contextActions={[<div>some action</div>]} />);

  expect(wrapper.dive().dive()).toMatchSnapshot();
});
