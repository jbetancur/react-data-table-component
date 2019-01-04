import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableHead from '../TableHead';

afterEach(cleanup);

test('component <TableHead /> should render correctly', () => {
  const { container } = renderWithTheme(<TableHead />);

  expect(container.firstChild).toMatchSnapshot();
});
