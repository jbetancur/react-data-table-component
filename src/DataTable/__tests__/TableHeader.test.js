import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableHeader from '../TableHeader';

afterEach(cleanup);

test('<TableHeader title showContextMenu /> should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" showContextMenu />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableHeader title contextTitle /> should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" contextTitle="items!!!" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableHeader title contextActions /> should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" contextActions={[<div>some action</div>]} />);

  expect(container.firstChild).toMatchSnapshot();
});
