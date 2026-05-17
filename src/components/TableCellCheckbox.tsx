import * as React from 'react';
import '../DataTable.css';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { prop, isEmpty } from '../util';
import type { RowState, SingleRowAction, RangeRowAction, ComponentProps, TableRow } from '../types';

type TableCellCheckboxProps<T> = {
	name: string;
	keyField: string;
	row: T;
	rowCount: number;
	selected: boolean;
	selectableRowsComponent: 'input' | React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
	selectableRowsComponentProps: ComponentProps;
	selectableRowsSingle: boolean;
	selectableRowDisabled: RowState<T>;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	onSelectedRange: (action: RangeRowAction<T>) => void;
	visibleRowsRef: React.MutableRefObject<T[]>;
	lastSelectedKeyRef: React.MutableRefObject<string | number | null>;
	selectableRowsRange: boolean;
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
	onSelectedRange,
	visibleRowsRef,
	lastSelectedKeyRef,
	selectableRowsRange,
}: TableCellCheckboxProps<T>): JSX.Element {
	const disabled = !!(selectableRowDisabled && selectableRowDisabled(row));
	const rowKey = prop(row as TableRow, keyField) as string | number | undefined;

	const handleOnRowSelected = (e?: React.MouseEvent | React.ChangeEvent) => {
		const native = (e as React.MouseEvent | undefined)?.nativeEvent;
		const shiftKey = native && 'shiftKey' in native ? native.shiftKey : false;
		const anchorKey = lastSelectedKeyRef.current;

		if (
			shiftKey &&
			selectableRowsRange &&
			!selectableRowsSingle &&
			anchorKey != null &&
			rowKey != null &&
			anchorKey !== rowKey
		) {
			const visibleRows = visibleRowsRef.current;
			const anchorIndex = visibleRows.findIndex(r => prop(r as TableRow, keyField) === anchorKey);
			const targetIndex = visibleRows.findIndex(r => prop(r as TableRow, keyField) === rowKey);

			if (anchorIndex !== -1 && targetIndex !== -1) {
				const [from, to] = anchorIndex < targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
				const rangeRows = visibleRows.slice(from, to + 1);
				// "select" is derived from the clicked row's current state: if it's currently
				// unselected, this gesture selects the whole range; if selected, it deselects.
				const select = !selected;
				const disabledRows = selectableRowDisabled ? rangeRows.filter(r => selectableRowDisabled(r)) : undefined;

				onSelectedRange({
					type: 'SELECT_RANGE',
					keyField,
					rangeRows,
					rowCount,
					select,
					disabledRows,
				});
				lastSelectedKeyRef.current = rowKey;
				return;
			}
		}

		onSelectedRow({
			type: 'SELECT_SINGLE_ROW',
			row,
			isSelected: selected,
			keyField,
			rowCount,
			singleSelect: selectableRowsSingle,
		});
		if (!isEmpty(rowKey)) lastSelectedKeyRef.current = rowKey as string | number;
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
