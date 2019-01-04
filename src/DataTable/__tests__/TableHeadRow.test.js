import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TableHeadRow from '../TableHeadRow';

afterEach(cleanup);

test('component <TableHeadRow /> should render correctly', () => {
  const { container } = render(<TableHeadRow />);
  expect(container.firstChild).toMatchSnapshot();
});
