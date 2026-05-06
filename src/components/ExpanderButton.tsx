import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { ExpandableIcon } from '../types';

type ExpanderButtonProps<T> = {
	disabled?: boolean;
	expanded?: boolean;
	expandableIcon: ExpandableIcon;
	id: string | number;
	row: T;
	onToggled?: (row: T) => void;
};

function ExpanderButton<T>({
	disabled = false,
	expanded = false,
	expandableIcon,
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
			aria-label={expanded ? 'Collapse Row' : 'Expand Row'}
			type="button"
		>
			{icon}
		</button>
	);
}

export default ExpanderButton;
