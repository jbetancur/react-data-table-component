import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TableBody from '../TableBody';

afterEach(cleanup);

test('<TableBody /> should render correctly', () => {
  const { container } = render(<TableBody />);
  expect(container.firstChild).toMatchSnapshot();
});
