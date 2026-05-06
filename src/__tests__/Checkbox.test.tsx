import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Checkbox from '../components/Checkbox';

test('should render correctly when a custom component is not provided', () => {
	const { container } = render(<Checkbox name="test" />);

	const input = container.firstChild as HTMLInputElement;
	expect(input.tagName).toBe('INPUT');
	expect(input.type).toBe('checkbox');
});

test('component <Checkbox component/> should render correctly with a custom checkbox', () => {
	// eslint-disable-next-line react/prefer-stateless-function
	class CustomComp extends React.Component {
		render() {
			return <div>25 schmeckles</div>;
		}
	}

	const { getByText } = render(<Checkbox name="test" component={CustomComp} />);

	expect(getByText('25 schmeckles')).not.toBeNull();
});

test('component <Checkbox component/> should render correctly with custom props', () => {
	const { container } = render(<Checkbox name="test" componentOptions={{ test: 'false' }} />);

	const input = container.firstChild as HTMLInputElement;
	expect(input.tagName).toBe('INPUT');
});

test('component <Checkbox indeterminate /> should toggle indeterminate to true on the element', () => {
	const { container } = render(<Checkbox name="test" indeterminate />);
	const input = container.firstChild as HTMLInputElement;

	expect(input.indeterminate).toBe(true);
});

test('component <Checkbox indeterminate={false} /> should not toggle indeterminate if there is no change', () => {
	const { container } = render(<Checkbox name="test" indeterminate={false} />);
	const input = container.firstChild as HTMLInputElement;

	expect(input.indeterminate).toBe(false);
});

test('should handle onClick', () => {
	const mockCallback = vi.fn();
	const { container } = render(<Checkbox name="test" onClick={mockCallback} />);
	const input = container.firstChild as HTMLInputElement;

	fireEvent.click(input);

	expect(mockCallback).toBeCalled();
});
