import * as React from 'react';
import '../DataTable.css';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { RowState, SingleRowAction, ComponentProps } from '../types';

type TableCellCheckboxProps<T> = {
	name: string;
	keyField: string;
	row: T;
	rowCount: number;
	selected: boolean;
	selectableRowsComponent: 'input' | React.ReactNode;
	selectableRowsComponentProps: ComponentProps;
	selectableRowsSingle: boolean;
	selectableRowDisabled: RowState<T>;
	onSelectedRow: (action: SingleRowAction<T>) => void;
};

function TableCellCheckbox<T>({
	name,
	keyField,
	row,
	rowCount,
	selected,
	selectableRowsComponent,
	selectableRowsComponentProps,
	selectableRowsSingle,
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
			singleSelect: selectableRowsSingle,
		});
	};

	return (
		<CellBase
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
			className={['rdt_TableCell', 'rdt_cellCheckbox'].join(' ')}
			role="cell"
			$noPadding
		>
			<Checkbox
				name={name}
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				checked={selected}
				aria-checked={selected}
				onClick={handleOnRowSelected}
				disabled={disabled}
			/>
		</CellBase>
	);
}

export default TableCellCheckbox;
