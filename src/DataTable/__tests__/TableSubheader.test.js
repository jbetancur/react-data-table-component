import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableSubheader from '../TableSubheader';

afterEach(cleanup);

test('TableSubheader defaults should render correctly', () => {
  const { container } = renderWithTheme(<TableSubheader />);

  expect(container.firstChild).toMatchSnapshot();
});

test('TableSubheader with component should render correctly', () => {
  const { container } = renderWithTheme(<TableSubheader component={<div />} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('TableSubheader with component should render when wrap is false', () => {
  const { container } = renderWithTheme(<TableSubheader component={<div />} wrapContent={false} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('TableSubheader with component should render correctly with left align', () => {
  const { container } = renderWithTheme(<TableSubheader component={<div />} align="left" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('TableSubheader with component should render correctly with center align', () => {
  const { container } = renderWithTheme(<TableSubheader component={<div />} align="center" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('TableSubheader with component should render correctly with right align', () => {
  const { container } = renderWithTheme(<TableSubheader component={<div />} align="right" />);

  expect(container.firstChild).toMatchSnapshot();
});
