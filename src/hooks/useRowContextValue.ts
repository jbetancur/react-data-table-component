import * as React from 'react';
import type { RowContextValue } from '../context/RowContext';

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
			options.selection,
			options.expansion,
			options.rowEvents,
			options.columnDrag,
			options.columnWidths,
			options.pinnedOffsets,
			options.animateRows,
			options.cellNavigation,
			options.activeCell,
			options.rowMenu,
		],
	);
}
