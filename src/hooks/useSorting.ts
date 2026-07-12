import * as React from 'react';
import type { SortOrder, SortAction, SortColumn } from '../types';

/**
 * Sorting feature slice. Always present (headers can always sort-capable render).
 * `sortColumns` changes identity on every sort interaction — that is legitimate
 * (headers must re-render); TableCol's memo does per-column checks inside the
 * slice to keep unaffected columns from re-rendering. The remaining fields are
 * config that also feeds the SORT_CHANGE action (selection-clearing behaviour).
 */
export type SortingSlice<T> = {
	sortDirection: SortOrder;
	sortColumns: SortColumn<T>[];
	/** Sorting is unavailable table-wide: loading, or nothing to sort. */
	sortDisabled: boolean;
	sortMulti: boolean;
	defaultSortDirection: SortOrder;
	sortIcon?: React.ReactNode;
	sortServer: boolean;
	pagination: boolean;
	paginationServer: boolean;
	persistSelectedOnSort: boolean;
	selectableRowsVisibleOnly: boolean;
	onSort: (action: SortAction<T>) => void;
};

export default function useSorting<T>(options: SortingSlice<T>): SortingSlice<T> {
	const {
		sortDirection,
		sortColumns,
		sortDisabled,
		sortMulti,
		defaultSortDirection,
		sortIcon,
		sortServer,
		pagination,
		paginationServer,
		persistSelectedOnSort,
		selectableRowsVisibleOnly,
		onSort,
	} = options;
	return React.useMemo(
		() => ({
			sortDirection,
			sortColumns,
			sortDisabled,
			sortMulti,
			defaultSortDirection,
			sortIcon,
			sortServer,
			pagination,
			paginationServer,
			persistSelectedOnSort,
			selectableRowsVisibleOnly,
			onSort,
		}),
		[
			sortDirection,
			sortColumns,
			sortDisabled,
			sortMulti,
			defaultSortDirection,
			sortIcon,
			sortServer,
			pagination,
			paginationServer,
			persistSelectedOnSort,
			selectableRowsVisibleOnly,
			onSort,
		],
	);
}
