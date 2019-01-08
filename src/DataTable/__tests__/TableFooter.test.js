import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableFooter from '../TableFooter';

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = renderWithTheme(<TableFooter />);

  expect(container.firstChild).toMatchSnapshot();
});
