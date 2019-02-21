import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import TableHeader from '../TableHeader';

afterEach(cleanup);

test('<TableHeader title showContextMenu should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableHeader title contextTitle should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" contextTitle="items!!!" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableHeader with actions should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" actions={<><div>some action</div>, <div>some action 2</div></>} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<TableHeader with showContextMenu/contextActions should render correctly', () => {
  const { container } = renderWithTheme(<TableHeader title="whoa!" showContextMenu contextActions={<><div>some action</div>, <div>some action 2</div></>} />);

  expect(container.firstChild).toMatchSnapshot();
});
