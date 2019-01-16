import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCellExpander from '../TableCellExpander';

const columnMock = {
  id: 123,
  name: 'Name',
  selector: 'name',
};

const rowMock = {
  id: 456,
  name: 'testname',
};


afterEach(cleanup);

test('component <TableCellExpander /> should render correctly', () => {
  const { container } = renderWithTheme(
    <TableCellExpander row={rowMock} column={columnMock} onExpandToggled={jest.fn()} />,
  );

  expect(container.firstChild).toMatchSnapshot();
});
