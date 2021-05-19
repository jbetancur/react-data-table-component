import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { AllRowsAction, RowState } from './types';

const TableColStyle = styled(CellBase)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;

interface TableColCheckboxProps<T> {
	head?: boolean;
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

function TableColCheckbox<T>({
	head = true,
	rowData,
	keyField,
	allSelected,
	mergeSelections,
	selectedRows,
	selectableRowsComponent,
	selectableRowsComponentProps,
	selectableRowDisabled,
	onSelectAllRows,
}: TableColCheckboxProps<T>): JSX.Element {
	const indeterminate = selectedRows.length > 0 && !allSelected;
	const rows = selectableRowDisabled ? rowData.filter((row: T) => !selectableRowDisabled(row)) : rowData;
	const isDisabled = rows.length === 0;
	// The row count should subtrtact rows that are disabled
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
		<TableColStyle className="rdt_TableCol" head={head} noPadding>
			<Checkbox
				name="select-all-rows"
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				onClick={handleSelectAll}
				checked={allSelected}
				indeterminate={indeterminate}
				disabled={isDisabled}
			/>
		</TableColStyle>
	);
}

export default TableColCheckbox;
