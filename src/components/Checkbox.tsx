import * as React from 'react';
import { handleFunctionProps, noop } from '../util';

const defaultComponentName = 'input';

interface CheckboxProps {
	name: string;
	component?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>> | string;
	componentOptions?: { [key: string]: unknown };
	indeterminate?: boolean;
	checked?: boolean;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	/** Roving tabindex when cell navigation is enabled */
	tabIndex?: number;
}

function Checkbox({
	name,
	component = defaultComponentName,
	componentOptions = { style: {} },
	indeterminate = false,
	checked = false,
	disabled = false,
	onClick = noop,
	tabIndex,
}: CheckboxProps): JSX.Element {
	const setCheckboxRef = (checkbox: HTMLInputElement) => {
		if (checkbox) {
			checkbox.indeterminate = indeterminate;
		}
	};

	const resolvedComponentOptions = React.useMemo(
		() => handleFunctionProps(componentOptions, indeterminate),
		[componentOptions, indeterminate],
	);

	// Use case 2: custom component via selectableRowsComponent prop
	if (component !== defaultComponentName) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const TagName = component as React.ElementType<any>;
		return (
			<TagName
				type="checkbox"
				ref={setCheckboxRef}
				style={componentOptions.style as React.CSSProperties | undefined}
				onClick={disabled ? noop : onClick}
				name={name}
				aria-label={name}
				checked={checked}
				disabled={disabled}
				{...resolvedComponentOptions}
				{...(tabIndex !== undefined && { tabIndex })}
				onChange={noop}
			/>
		);
	}

	// Use case 1: pure CSS checkbox — state classes drive ::before / ::after visuals
	const cls = [
		'rdt_Checkbox',
		checked && 'rdt_checked',
		indeterminate && 'rdt_indeterminate',
		disabled && 'rdt_disabled',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<span className={cls}>
			<input
				type="checkbox"
				ref={setCheckboxRef}
				onClick={disabled ? noop : onClick}
				name={name}
				aria-label={name}
				checked={checked}
				disabled={disabled}
				tabIndex={tabIndex}
				onChange={noop}
			/>
		</span>
	);
}

export default React.memo(Checkbox);
