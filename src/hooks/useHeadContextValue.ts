import * as React from 'react';
import type { HeadContextValue } from '../context/HeadContext';

/**
 * Memoizes the HeadContext value passed to descendants.
 * Internal hook — owns the dependency list so DataTable.tsx stays thin.
 */
export default function useHeadContextValue<T>(options: HeadContextValue<T>): HeadContextValue<T> {
	return React.useMemo(
		() => options,
		// We list each field individually so the memo invalidates on field changes,
		// not on every fresh `options` object the caller passes in.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			options.sorting,
			options.fixedHeader,
			options.dense,
			options.draggingColumnId,
			options.draggingGroupKey,
			options.filtering,
			options.columnWidths,
			options.pinnedOffsets,
			options.resize,
			options.selectAll,
			options.cellNavigation,
			options.activeCell,
			options.columnDrag,
			options.headerMenu,
		],
	);
}
