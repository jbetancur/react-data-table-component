import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Checkbox from '../components/Checkbox';

test('should render an input[type=checkbox] when no custom component is provided', () => {
	const { container } = render(<Checkbox name="test" />);
	const input = container.querySelector('input') as HTMLInputElement;

	expect(input).not.toBeNull();
	expect(input.type).toBe('checkbox');
	expect(input.name).toBe('test');
});

test('should render a custom checkbox component when provided', () => {
	class CustomComp extends React.Component {
		render() {
			return <div>25 schmeckles</div>;
		}
	}

	const { getByText } = render(<Checkbox name="test" component={CustomComp} />);

	expect(getByText('25 schmeckles')).not.toBeNull();
});

test('should still render an input when componentOptions is provided without a component', () => {
	const { container } = render(<Checkbox name="test" componentOptions={{ test: 'false' }} />);
	const input = container.querySelector('input') as HTMLInputElement;

	expect(input.tagName).toBe('INPUT');
});

test('should set indeterminate on the underlying input when indeterminate=true', () => {
	const { container } = render(<Checkbox name="test" indeterminate />);
	const input = container.querySelector('input') as HTMLInputElement;

	expect(input.indeterminate).toBe(true);
});

test('should leave indeterminate=false on the underlying input when indeterminate is not set', () => {
	const { container } = render(<Checkbox name="test" indeterminate={false} />);
	const input = container.querySelector('input') as HTMLInputElement;

	expect(input.indeterminate).toBe(false);
});

test('should call onClick when the underlying input is clicked', () => {
	const onClick = vi.fn();
	const { container } = render(<Checkbox name="test" onClick={onClick} />);
	const input = container.querySelector('input') as HTMLInputElement;

	fireEvent.click(input);

	expect(onClick).toBeCalled();
});

test('should not call onClick when disabled', () => {
	const onClick = vi.fn();
	const { container } = render(<Checkbox name="test" disabled onClick={onClick} />);
	const input = container.querySelector('input') as HTMLInputElement;

	fireEvent.click(input);

	expect(onClick).not.toBeCalled();
});
