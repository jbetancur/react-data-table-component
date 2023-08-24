import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { AllRowsAction, RowState } from './types';

const ColumnStyle = styled(CellBase)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;

interface ColumnCheckboxProps<T> {
	headCell?: boolean;
	selectableRowsComponent: 'input' | React.ReactNode;
	selectableRowsComponentProps: Record<string, unknown>;
	selectableRowDisabled: RowState<T>;
	keyField: string;
	mergeSelections: boolean;
	rowData: T[];
	selectedRows: T[];
	allSelected: boolean;
	onSelectAllRows: (action: AllRowsAction<T>) => void;
}

function ColumnCheckbox<T>({
	headCell = true,
	rowData,
	keyField,
	allSelected,
	mergeSelections,
	selectedRows,
	selectableRowsComponent,
	selectableRowsComponentProps,
	selectableRowDisabled,
	onSelectAllRows,
}: ColumnCheckboxProps<T>): JSX.Element {
	const indeterminate = selectedRows.length > 0 && !allSelected;
	const rows = selectableRowDisabled ? rowData.filter((row: T) => !selectableRowDisabled(row)) : rowData;
	const isDisabled = rows.length === 0;
	// The row count should subtract rows that are disabled
	const rowCount = Math.min(rowData.length, rows.length);

	const handleSelectAll = () => {
		onSelectAllRows({
			type: 'SELECT_ALL_ROWS',
			rows,
			rowCount,
			mergeSelections,
			keyField,
		});
	};

	return (
		<ColumnStyle className="rdt_TableCol" $headCell={headCell} $noPadding>
			<Checkbox
				name="select-all-rows"
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				onClick={handleSelectAll}
				checked={allSelected}
				indeterminate={indeterminate}
				disabled={isDisabled}
			/>
		</ColumnStyle>
	);
}

export default ColumnCheckbox;
