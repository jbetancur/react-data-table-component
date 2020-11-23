import * as React from 'react';
import styled from 'styled-components';
import { ExpandableIcon } from './types';

const ButtonStyle = styled.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({ theme }) => theme.expanderButton.style};
`;

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
	const icon = expanded ? expandableIcon.expanded : expandableIcon.collapsed;
	const handleToggle = () => onToggled && onToggled(row);

	return (
		<ButtonStyle
			aria-disabled={disabled}
			onClick={handleToggle}
			data-testid={`expander-button-${id}`}
			disabled={disabled}
			aria-label={expanded ? 'Collapse Row' : 'Expand Row'}
			role="button"
			type="button"
		>
			{icon}
		</ButtonStyle>
	);
}

export default ExpanderButton;
