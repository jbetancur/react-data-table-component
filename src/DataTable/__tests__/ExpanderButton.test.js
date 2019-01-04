import 'jest-styled-components';
import React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import ExpanderButton from '../ExpanderButton';

afterEach(cleanup);

test('component <ExpanderButton expanded={false} /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderButton data={{}} index={0} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ExpanderButton expanded /> should render correctly', () => {
  const { container } = renderWithTheme(<ExpanderButton data={{}} index={0} expanded />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <ExpanderButton onToggled /> with columns should render correctly', () => {
  const mockCallBack = jest.fn();
  const { container } = renderWithTheme(<ExpanderButton data={{}} index={0} onToggled={mockCallBack} />);
  fireEvent.click(container.firstChild);

  expect(mockCallBack).toHaveBeenCalled();
});
