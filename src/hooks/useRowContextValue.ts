import * as React from 'react';
import { RowContextValue } from '../context/RowContext';

/**
 * Memoizes the RowContext value passed to descendants.
 * Internal hook — owns the dependency list so DataTable.tsx stays thin.
 */
export default function useRowContextValue<T>(options: RowContextValue<T>): RowContextValue<T> {
	return React.useMemo(
		() => options,
		// We list each field individually so the memo invalidates on field changes,
		// not on every fresh `options` object the caller passes in.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			options.keyField,
			options.columns,
			options.dense,
			options.striped,
			options.highlightOnHover,
			options.pointerOnHover,
			options.conditionalRowStyles,
			options.selectableRows,
			options.selectableRowsComponent,
			options.selectableRowsComponentProps,
			options.selectableRowsHighlight,
			options.selectableRowsSingle,
			options.selectableRowDisabled,
			options.expandableRows,
			options.expandableIcon,
			options.expandableRowsComponent,
			options.expandableRowsComponentProps,
			options.expandableRowsHideExpander,
			options.expandOnRowClicked,
			options.expandOnRowDoubleClicked,
			options.expandableInheritConditionalStyles,
			options.onRowClicked,
			options.onRowDoubleClicked,
			options.onRowMouseEnter,
			options.onRowMouseLeave,
			options.onRowExpandToggled,
			options.onSelectedRow,
			options.onDragStart,
			options.onDragOver,
			options.onDragEnd,
			options.onDragEnter,
			options.onDragLeave,
			options.columnWidths,
			options.animateRows,
		],
	);
}
