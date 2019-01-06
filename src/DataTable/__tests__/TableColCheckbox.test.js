import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableColCheckbox from '../TableColCheckbox';

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = renderWithTheme(<TableColCheckbox row={{}} column={{ selector: 'test' }} onClick={jest.fn()} />);

  expect(container.firstChild).toMatchSnapshot();
});
