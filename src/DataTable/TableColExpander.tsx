import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButtonHead from './ExpanderButtonHead';
import { ExpandableIcon, ExpandAllRowsAction, RowState } from './types';

const ColumnStyle = styled(CellBase)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;

interface ColumnExpanderProps<T> {
	headCell?: boolean;
	keyField: string;
	mergeExpansions: boolean;
	rowData: T[];
	expandedRows: T[];
	allExpanded: boolean;
	expandableIcon: ExpandableIcon;
	expandableRowDisabled: RowState<T>;
	onExpandAllRows: (action: ExpandAllRowsAction<T>) => void;
}

function ColumnExpander<T>({
	headCell = true,
	rowData,
	keyField,
	allExpanded,
	mergeExpansions,
	expandedRows,
	expandableIcon,
	expandableRowDisabled,
	onExpandAllRows,
}: ColumnExpanderProps<T>): JSX.Element {
	const indeterminate = expandedRows.length > 0 && !allExpanded;
	const rows = expandableRowDisabled ? rowData.filter((row: T) => !expandableRowDisabled(row)) : rowData;
	const isDisabled = rows.length === 0;
	// The row count should subtract rows that are disabled
	const rowCount = Math.min(rowData.length, rows.length);

	const handleExpandAll = () => {
		onExpandAllRows({
			type: 'EXPAND_ALL_ROWS',
			rows,
			rowCount,
			mergeExpansions,
			keyField,
		});
	};

	return (
		<ColumnStyle className="rdt_TableCol" headCell={headCell} noPadding>
			<ExpanderButtonHead
				expanded={indeterminate || allExpanded}
				expandableIcon={expandableIcon}
				disabled={isDisabled}
				onToggled={handleExpandAll}
			/>
		</ColumnStyle>
	);
}

export default ColumnExpander;
