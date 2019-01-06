import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TableWrapper from '../TableWrapper';

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = render(<TableWrapper />);
  expect(container.firstChild).toMatchSnapshot();
});
