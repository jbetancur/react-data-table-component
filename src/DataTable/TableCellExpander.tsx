import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';
import { ExpandableIcon } from './types';

const TableCellExpanderStyle = styled(CellBase)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({ theme }) => theme.expanderCell.style};
`;

type TableCellExpanderProps<T> = {
	disabled: boolean;
	expanded: boolean;
	expandableIcon: ExpandableIcon;
	id: string | number;
	row: T;
	onToggled: (row: T) => void;
};

function TableCellExpander<T>({
	row,
	expanded = false,
	expandableIcon,
	id,
	onToggled,
	disabled = false,
}: TableCellExpanderProps<T>): JSX.Element {
	return (
		<TableCellExpanderStyle onClick={(e: React.MouseEvent) => e.stopPropagation()} noPadding>
			<ExpanderButton
				id={id}
				row={row}
				expanded={expanded}
				expandableIcon={expandableIcon}
				disabled={disabled}
				onToggled={onToggled}
			/>
		</TableCellExpanderStyle>
	);
}

export default TableCellExpander;
