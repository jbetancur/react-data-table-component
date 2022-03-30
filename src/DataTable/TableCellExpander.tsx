import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';
import { ExpandableIcon, ExpandSingleRowAction, RowState } from './types';

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
	keyField: string;
	rowCount: number;
	expandableRowsSingle: boolean;
	expandableRowDisabled: RowState<T>;
	onExpandedRow: (action: ExpandSingleRowAction<T>) => void;
};

function CellExpander<T>({
	row,
	expanded = false,
	expandableIcon,
	id,
	keyField,
	rowCount,
	onExpandedRow,
	expandableRowsSingle,
	expandableRowDisabled,
}: CellExpanderProps<T>): JSX.Element {
	const disabled = !!(expandableRowDisabled && expandableRowDisabled(row));

	const handleOnRowExpanded = () => {
		onExpandedRow({
			type: 'EXPAND_SINGLE_ROW',
			row,
			isExpanded: expanded,
			keyField,
			rowCount,
			singleExpand: expandableRowsSingle,
		});
	};

	return (
		<CellExpanderStyle onClick={(e: React.MouseEvent) => e.stopPropagation()} noPadding>
			<ExpanderButton
				id={id}
				row={row}
				expanded={expanded}
				expandableIcon={expandableIcon}
				disabled={disabled}
				onToggled={handleOnRowExpanded}
			/>
		</CellExpanderStyle>
	);
}

export default CellExpander;
