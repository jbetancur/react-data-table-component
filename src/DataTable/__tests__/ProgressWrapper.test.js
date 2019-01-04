import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';

import ProgressWrapper from '../ProgressWrapper';

afterEach(cleanup);

test('component <ProgressWrapper component /> should render correctly when a component is passed that is a string', () => {
  const { container } = render(<ProgressWrapper component="A Component that is passed in">A String that is passed in</ProgressWrapper>);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ProgressWrapper component /> should render correctly when a component is passed that is a react component', () => {
  const { container } = render(<ProgressWrapper component={<div>A String that is passed in</div>}><div>A String that is passed in</div></ProgressWrapper>);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ProgressWrapper centered /> should render correctly when a component is passed that is a react component', () => {
  const { container } = render(<ProgressWrapper centered component="A Component that is passed in" />);

  expect(container.firstChild).toMatchSnapshot();
});
