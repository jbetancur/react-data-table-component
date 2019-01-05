import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableCell from '../TableCell';

afterEach(cleanup);

test('<TableCell /> should render correctly', () => {
  const { container } = renderWithTheme(<TableCell row={{}} column={{ selector: 'test' }} />);

  expect(container.firstChild).toMatchSnapshot();
});
