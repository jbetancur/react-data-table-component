import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import ResponsiveWrapper from '../ResponsiveWrapper';

afterEach(cleanup);

test('<ResponsiveWrapper /> should render correctly', () => {
  const { container } = render(<ResponsiveWrapper />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<ResponsiveWrapper responsive /> should render correctly ', () => {
  const { container } = render(<ResponsiveWrapper responsive />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<ResponsiveWrapper overflowY /> should not apply overFlowY without an overflowYOffset or not responsive ', () => {
  const { container } = render(<ResponsiveWrapper overflowY />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<ResponsiveWrapper responsive overflowY overflowYOffset="250px" /> should render correctly when overflowYOffset is provided ', () => {
  const { container } = render(<ResponsiveWrapper responsive overflowY overflowYOffset="250px" />);

  expect(container.firstChild).toMatchSnapshot();
});
