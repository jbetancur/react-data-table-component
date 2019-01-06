import 'jest-styled-components';
import React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import ExpanderButton from '../ExpanderButton';

const rowMock = {
  id: 456,
  name: 'testname',
};

afterEach(cleanup);

test('<ExpanderButton expanded={false} /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderButton row={rowMock} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<ExpanderButton expanded /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderButton row={rowMock} expanded />);

  expect(container.firstChild).toMatchSnapshot();
});

test('<ExpanderButton onToggled /> with columns should render correctly', () => {
  const mockCallBack = jest.fn();
  const { container } = renderWithTheme(<ExpanderButton row={rowMock} onToggled={mockCallBack} />);
  fireEvent.click(container.firstChild);

  expect(mockCallBack).toHaveBeenCalled();
});
