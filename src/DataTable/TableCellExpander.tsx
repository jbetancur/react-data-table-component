import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';
import { ExpandableIcon } from './types';

const CellExpanderStyle = styled(CellBase)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({ theme }) => theme.expanderCell.style};
`;

type CellExpanderProps<T> = {
	disabled: boolean;
	expanded: boolean;
	expandableIcon: ExpandableIcon;
	id: string | number;
	row: T;
	onToggled: (row: T) => void;
};

function CellExpander<T>({
	row,
	expanded = false,
	expandableIcon,
	id,
	onToggled,
	disabled = false,
}: CellExpanderProps<T>): JSX.Element {
	return (
		<CellExpanderStyle onClick={(e: React.MouseEvent) => e.stopPropagation()} $noPadding>
			<ExpanderButton
				id={id}
				row={row}
				expanded={expanded}
				expandableIcon={expandableIcon}
				disabled={disabled}
				onToggled={onToggled}
			/>
		</CellExpanderStyle>
	);
}

export default CellExpander;
