import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCellCheckbox from '../TableCellCheckbox';

afterEach(cleanup);

test('component <TableCellCheckbox /> should render correctly', () => {
  const { container } = renderWithTheme(<TableCellCheckbox row={{}} column={{ selector: 'test' }} onClick={() => { }} />);

  expect(container.firstChild).toMatchSnapshot();
});
