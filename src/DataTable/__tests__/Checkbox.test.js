import 'jest-styled-components';
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

afterEach(cleanup);

test('should render correctly when a custom component is not provided', () => {
  const { container } = render(<Checkbox name="test" />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with a custom checkbox', () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class CustomComp extends React.Component {
    render() {
      return (<div>25 schmeckles</div>);
    }
  }

  const { container } = render(<Checkbox name="test" component={CustomComp} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with custom props', () => {
  const { container } = render(<Checkbox name="test" componentOptions={{ test: 'false' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('component <Checkbox indeterminate /> should toggle indeterminate to true on the element', () => {
  const { container } = render(<Checkbox name="test" indeterminate />);

  expect(container.firstChild.indeterminate).toBe(true);
});

test('component <Checkbox indeterminate={false} /> should not toggle indeterminate if there is no change', () => {
  const { container } = render(<Checkbox name="test" indeterminate={false} />);

  expect(container.firstChild.indeterminate).toBe(false);
});

test('should handle onClick', () => {
  const mockCallback = jest.fn();
  const { container } = render(<Checkbox name="test" onClick={mockCallback} />);
  fireEvent.click(container.firstChild);

  expect(mockCallback).toBeCalled();
});
