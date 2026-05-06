import * as React from 'react';
import { handleFunctionProps, noop } from '../util';

const defaultComponentName = 'input';

const calculateBaseStyle = (disabled: boolean): React.CSSProperties => ({
	fontSize: '18px',
	appearance: 'auto',
	WebkitAppearance: 'checkbox',
	...(!disabled && { cursor: 'pointer' }),
	padding: 0,
	marginTop: '1px',
	verticalAlign: 'middle',
	position: 'relative',
});

interface CheckboxProps {
	name: string;
	component?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>> | string;
	componentOptions?: { [key: string]: unknown };
	indeterminate?: boolean;
	checked?: boolean;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

function Checkbox({
	name,
	component = defaultComponentName,
	componentOptions = { style: {} },
	indeterminate = false,
	checked = false,
	disabled = false,
	onClick = noop,
}: CheckboxProps): JSX.Element {
	const setCheckboxRef = (checkbox: HTMLInputElement) => {
		if (checkbox) {
			// eslint-disable-next-line no-param-reassign
			checkbox.indeterminate = indeterminate;
		}
	};

	// Cast for JSX rendering: TagName may be a string ('input') or a component;
	// both are valid JSX element types at runtime.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const TagName = component as React.ElementType<any>;
	const baseStyle =
		component !== defaultComponentName
			? (componentOptions.style as React.CSSProperties | undefined)
			: calculateBaseStyle(disabled);
	const resolvedComponentOptions = React.useMemo(
		() => handleFunctionProps(componentOptions, indeterminate),
		[componentOptions, indeterminate],
	);

	return (
		<TagName
			// allow this component to fully control these options
			type="checkbox"
			ref={setCheckboxRef}
			style={baseStyle}
			onClick={disabled ? noop : onClick}
			name={name}
			aria-label={name}
			checked={checked}
			disabled={disabled}
			{...resolvedComponentOptions}
			onChange={noop} // prevent uncontrolled checkbox warnings -  we don't need onChange
		/>
	);
}

export default React.memo(Checkbox);
