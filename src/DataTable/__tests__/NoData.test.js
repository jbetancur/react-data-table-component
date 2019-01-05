import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import NoData from '../NoData';

afterEach(cleanup);

test('should render correctly when a component is passed that is a string', () => {
  const { container } = render(<NoData component="A Component that is passed in">A String that is passed in</NoData>);
  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly when a component is passed that is a react component', () => {
  const { container } = render(<NoData component={<div>A String that is passed in</div>}><div>A String that is passed in</div></NoData>);
  expect(container.firstChild).toMatchSnapshot();
});
