import * as React from 'react';
import '../DataTable.css';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { prop, isEmpty } from '../util';
import type { TableRow } from '../types';
import type { NavCellProps } from '../context/RowContext';
import type { RowSelectionSlice } from '../hooks/useSelection';

type TableCellCheckboxProps<T> = {
	name: string;
	keyField: string;
	row: T;
	rowCount: number;
	selected: boolean;
	selection: NonNullable<RowSelectionSlice<T>>;
	nav?: NavCellProps;
};

function TableCellCheckbox<T>({
	name,
	keyField,
	row,
	rowCount,
	selected,
	selection,
	nav,
}: TableCellCheckboxProps<T>): JSX.Element {
	const {
		component: selectableRowsComponent,
		componentProps: selectableRowsComponentProps,
		single: selectableRowsSingle,
		disabled: selectableRowDisabled,
		range: selectableRowsRange,
		onSelectedRow,
		onSelectedRange,
		visibleRowsRef,
		lastSelectedKeyRef,
	} = selection;
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
			role={nav ? 'gridcell' : 'cell'}
			$noPadding
			tabIndex={nav ? -1 : undefined}
			data-nav-row={nav?.row}
			data-nav-col={nav?.col}
			data-nav-widget={nav ? 'true' : undefined}
		>
			<Checkbox
				name={name}
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				checked={selected}
				aria-checked={selected}
				onClick={handleOnRowSelected}
				disabled={disabled}
				tabIndex={nav ? (nav.active ? 0 : -1) : undefined}
			/>
		</CellBase>
	);
}

export default TableCellCheckbox;
