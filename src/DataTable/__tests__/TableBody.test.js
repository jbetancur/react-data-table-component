import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TableBody from '../TableBody';

afterEach(cleanup);

test('<TableBody /> should render correctly', () => {
  const { container } = render(<TableBody />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableBody /> should render correctly when fixedHeader', () => {
  const { container } = render(<TableBody fixedHeader />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableBody /> should render correctly when fixedHeader with an offset', () => {
  const { container } = render(<TableBody fixedHeader hasOffset />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableBody /> should render correctly when fixedHeader with an offset with a value', () => {
  const { container } = render(<TableBody fixedHeader hasOffset offset="100px" />);

  expect(container.firstChild).toMatchSnapshot();
});
