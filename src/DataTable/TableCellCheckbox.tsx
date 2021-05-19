import * as React from 'react';
import styled from 'styled-components';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { RowRecord, RowState, SingleRowAction } from './types';

const TableCellCheckboxStyle = styled(CellBase)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;

type TableCellCheckboxProps<T> = {
	keyField: string;
	row: T;
	rowCount: number;
	selected: boolean;
	selectableRowsComponent: 'input' | React.ReactNode;
	selectableRowsComponentProps: Record<string, unknown>;
	selectableRowDisabled: RowState<T>;
	onSelectedRow: (action: SingleRowAction<T>) => void;
};

function TableCellCheckbox<T extends RowRecord>({
	keyField,
	row,
	rowCount,
	selected,
	selectableRowsComponent,
	selectableRowsComponentProps,
	selectableRowDisabled,
	onSelectedRow,
}: TableCellCheckboxProps<T>): JSX.Element {
	const disabled = !!(selectableRowDisabled && selectableRowDisabled(row));

	const handleOnRowSelected = () => {
		onSelectedRow({
			type: 'SELECT_SINGLE_ROW',
			row,
			isSelected: selected,
			keyField,
			rowCount,
		});
	};

	return (
		<TableCellCheckboxStyle onClick={(e: React.MouseEvent) => e.stopPropagation()} className="rdt_TableCell" noPadding>
			<Checkbox
				name={`select-row-${row[keyField]}`}
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				checked={selected}
				aria-checked={selected}
				onClick={handleOnRowSelected}
				disabled={disabled}
			/>
		</TableCellCheckboxStyle>
	);
}

export default TableCellCheckbox;
