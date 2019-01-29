import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCol from '../TableCol';

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = renderWithTheme(
    <TableCol
      onColumnClick={jest.fn()}
      column={{ id: 1, name: 'test', selector: 'name' }}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});
