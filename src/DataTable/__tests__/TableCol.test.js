import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCol from '../TableCol';

afterEach(cleanup);

test('component <TableCol /> should render correctly', () => {
  const { container } = renderWithTheme(<TableCol />);

  expect(container.firstChild).toMatchSnapshot();
});
