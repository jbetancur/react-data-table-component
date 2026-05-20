import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import type { ExpandableIcon, Localization } from '../types';

type ExpandableRowsOptions = NonNullable<Localization['expandable']>;

type ExpanderButtonProps<T> = {
	disabled?: boolean;
	expanded?: boolean;
	expandableIcon: ExpandableIcon;
	expandableRowsOptions?: ExpandableRowsOptions;
	id: string | number;
	row: T;
	onToggled?: (row: T) => void;
};

function ExpanderButton<T>({
	disabled = false,
	expanded = false,
	expandableIcon,
	expandableRowsOptions,
	id,
	row,
	onToggled,
}: ExpanderButtonProps<T>): JSX.Element {
	const customStyles = useStyles();
	const icon = expanded ? expandableIcon.expanded : expandableIcon.collapsed;
	const handleToggle = () => onToggled && onToggled(row);

	return (
		<button
			className="rdt_expanderButton"
			style={customStyles.expanderButton?.style}
			aria-disabled={disabled}
			onClick={handleToggle}
			data-testid={`expander-button-${id}`}
			disabled={disabled}
			aria-label={
				expanded
					? (expandableRowsOptions?.collapseRowAriaLabel ?? 'Collapse Row')
					: (expandableRowsOptions?.expandRowAriaLabel ?? 'Expand Row')
			}
			type="button"
		>
			{icon}
		</button>
	);
}

export default ExpanderButton;
