import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCellExpander from '../TableCellExpander';

afterEach(cleanup);

test('component <TableCellExpander /> should render correctly', () => {
  const { container } = renderWithTheme(<TableCellExpander row={{}} column={{ selector: 'test' }} index={0} />);

  expect(container.firstChild).toMatchSnapshot();
});
