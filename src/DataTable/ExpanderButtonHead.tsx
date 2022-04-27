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

type ExpanderButtonHeadProps = {
	name: string;
	disabled?: boolean;
	expanded?: boolean;
	expandableIcon: ExpandableIcon;
	onToggled?: () => void;
};

function ExpanderButtonHead({
	name,
	disabled = false,
	expanded = false,
	expandableIcon,
	onToggled,
}: ExpanderButtonHeadProps): JSX.Element {
	const icon = expanded ? expandableIcon.expanded : expandableIcon.collapsed;
	const handleToggle = onToggled;

	return (
		<ButtonStyle
			name={name}
			aria-disabled={disabled}
			onClick={handleToggle}
			disabled={disabled}
			aria-label={expanded ? 'Collapse Row' : 'Expand Row'}
			role="button"
			type="button"
		>
			{icon}
		</ButtonStyle>
	);
}

export default ExpanderButtonHead;
