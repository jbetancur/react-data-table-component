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
			options.selectedColumn,
			options.sortDirection,
			options.sortIcon,
			options.sortServer,
			options.pagination,
			options.paginationServer,
			options.persistSelectedOnSort,
			options.selectableRowsVisibleOnly,
			options.fixedHeader,
			options.dense,
			options.draggingColumnId,
			options.draggingGroupKey,
			options.filterValues,
			options.columnWidths,
			options.resizable,
			options.keyField,
			options.mergeSelections,
			options.allSelected,
			options.selectedRows,
			options.visibleRows,
			options.selectableRowsComponent,
			options.selectableRowsComponentProps,
			options.selectableRowDisabled,
			options.showSelectAll,
			options.progressPending,
			options.sortedData,
			options.onSelectAllRows,
			options.onSort,
			options.onFilterChange,
			options.onResizeStart,
			options.onDragStart,
			options.onDragOver,
			options.onDragEnd,
			options.onDragEnter,
			options.onDragLeave,
			options.onGroupDragStart,
			options.onGroupDragEnter,
			options.onGroupDragOver,
			options.onGroupDragEnd,
		],
	);
}
