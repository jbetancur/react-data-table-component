import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import ExpanderRow from '../ExpanderRow';
import { renderWithTheme } from '../../test-helpers';

afterEach(cleanup);

test('component <ExpanderRow /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderRow />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ExpanderRow numColumns /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderRow numColumns={5} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ExpanderRow /> with children should render correctly and have a data prop', () => {
  const { container } = renderWithTheme(<ExpanderRow data={{ name: 'morty' }}><div>Some Expander Content</div></ExpanderRow>);

  expect(container.firstChild).toMatchSnapshot();
});
