import 'jest-styled-components';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Table from '../Table';

afterEach(cleanup);

test('<Table /> should render correctly', () => {
  const { container } = render(<Table />);
  expect(container.firstChild).toMatchSnapshot();
});

test('<Table disabled={true} /> should render correctly ', () => {
  const { container } = render(<Table disabled />);
  expect(container.firstChild).toMatchSnapshot();
});
