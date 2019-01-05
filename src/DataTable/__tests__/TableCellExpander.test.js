import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import { DataTableProvider, defaultState } from '../DataTableContext';
import TableCellExpander from '../TableCellExpander';

afterEach(cleanup);

test('component <TableCellExpander /> should render correctly', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
    }}
    >
      <TableCellExpander row={{}} column={{ selector: 'test' }} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});
