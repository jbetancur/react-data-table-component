import * as React from 'react';
import { handleFunctionProps, noop } from './util';

const defaultComponentName = 'input';

const calculateBaseStyle = (disabled: boolean) => ({
	fontSize: '18px',
	...(!disabled && { cursor: 'pointer' }),
	padding: 0,
	marginTop: '1px',
	verticalAlign: 'middle',
	position: 'relative',
});

interface CheckboxProps {
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component?: any;
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

	const TagName = component;
	const baseStyle = TagName !== defaultComponentName ? componentOptions.style : calculateBaseStyle(disabled);
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
