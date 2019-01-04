import 'jest-styled-components';
import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import Checkbox from '../Checkbox';

afterEach(cleanup);

test('component <Checkbox /> should render correctly when a custom component is not provided', () => {
  const { container } = render(<Checkbox onClick={jest.fn()} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with a custom checkbox', () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class CustomComp extends React.Component {
    render() {
      return (<div>25 schmeckles</div>);
    }
  }

  const { container } = render(<Checkbox onClick={jest.fn()} component={CustomComp} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with custom props', () => {
  const { container } = render(<Checkbox onClick={jest.fn()} componentOptions={{ test: 'false' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox indeterminate /> should toggle indeterminate to true on the element', () => {
  const { container } = render(<Checkbox onClick={jest.fn()} indeterminate />);

  expect(container.firstChild.indeterminate).toBe(true);
});

test('component <Checkbox indeterminate={false} /> should not toggle indeterminate if theere is no change', () => {
  const { container } = render(<Checkbox onClick={jest.fn()} indeterminate={false} />);

  expect(container.firstChild.indeterminate).toBe(false);
});

test('component <Checkbox /> should handle onClick', () => {
  const mockCallback = jest.fn();
  const { container } = render(<Checkbox data={{ name: 'morty' }} index={1} onClick={mockCallback} />);
  fireEvent.click(container.firstChild);

  expect(mockCallback).toBeCalled();
  expect(mockCallback.mock.calls[0][0]).toEqual({ name: 'morty' });
  expect(mockCallback.mock.calls[0][1]).toBe(1);
  expect(mockCallback.mock.calls[0][2]).toBeDefined(); // TODO: mock event?
});
