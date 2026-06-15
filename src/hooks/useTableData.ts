import * as React from 'react';
import { sort, multiSort } from '../util';
import { SortOrder } from '../types';
import type { TableColumn, SortColumn, SortFunction, Selector } from '../types';

interface UseTableDataProps<T> {
	data: T[];
	columns: TableColumn<T>[];
	selectedColumn: TableColumn<T>;
	sortDirection: SortOrder;
	sortColumns: SortColumn<T>[];
	currentPage: number;
	rowsPerPage: number;
	pagination: boolean;
	paginationServer: boolean;
	sortServer: boolean;
	sortFunction: SortFunction<T> | null;
	onSort: (
		selectedColumn: TableColumn<T>,
		sortDirection: SortOrder,
		sortedRows: T[],
		sortColumns: SortColumn<T>[],
	) => void;
}

interface UseTableDataReturn<T> {
	sortedData: T[];
	tableRows: T[];
}

/**
 * hook to handle data transformations (sorting, pagination)
 */
export default function useTableData<T>(props: UseTableDataProps<T>): UseTableDataReturn<T> {
	const {
		data,
		selectedColumn,
		sortDirection,
		sortColumns,
		currentPage,
		rowsPerPage,
		pagination,
		paginationServer,
		sortServer,
		sortFunction,
		onSort,
	} = props;

	// Memoize sorted data with stable dependencies
	const sortedData = React.useMemo(() => {
		// Server-side sorting bypasses internal sorting
		if (sortServer) {
			return data;
		}

		// Multi-column sort: stable comparison across all sort columns in priority order.
		if (sortColumns.length > 1) {
			return multiSort(data, sortColumns);
		}

		// Use column-specific sort function if available
		if (selectedColumn?.sortFunction && typeof selectedColumn.sortFunction === 'function') {
			const sortFn = selectedColumn.sortFunction;
			const customSortFunction = sortDirection === SortOrder.ASC ? sortFn : (a: T, b: T) => sortFn(a, b) * -1;

			return [...data].sort(customSortFunction);
		}

		// Use default sort utility — cast selector to Primitive-returning variant required by sort().
		// Columns with ReactNode selectors should supply a sortFunction instead.
		return sort(data, selectedColumn?.selector as Selector<T> | undefined, sortDirection, sortFunction);
	}, [sortServer, selectedColumn, sortDirection, sortColumns, data, sortFunction]);

	// Memoize paginated table rows
	const tableRows = React.useMemo(() => {
		// Client-side pagination: slice the sorted data
		if (pagination && !paginationServer) {
			const lastIndex = currentPage * rowsPerPage;
			const firstIndex = lastIndex - rowsPerPage;

			return sortedData.slice(firstIndex, lastIndex);
		}

		// Server-side pagination or no pagination: return all sorted data
		return sortedData;
	}, [currentPage, pagination, paginationServer, rowsPerPage, sortedData]);

	// Notify parent when sort changes (but not on sortedData changes to avoid loops)
	const sortCallbackRef = React.useRef(onSort);
	const prevSortRef = React.useRef({ selectedColumn, sortDirection, sortColumns });

	React.useEffect(() => {
		sortCallbackRef.current = onSort;
	}, [onSort]);

	React.useEffect(() => {
		// Only call onSort if column, direction, or the multi-column config actually changed
		if (
			prevSortRef.current.selectedColumn !== selectedColumn ||
			prevSortRef.current.sortDirection !== sortDirection ||
			prevSortRef.current.sortColumns !== sortColumns
		) {
			prevSortRef.current = { selectedColumn, sortDirection, sortColumns };
			sortCallbackRef.current(selectedColumn, sortDirection, sortedData.slice(0), sortColumns);
		}
	}, [selectedColumn, sortDirection, sortColumns, sortedData]);

	return {
		sortedData,
		tableRows,
	};
}
