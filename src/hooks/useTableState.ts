import * as React from 'react';
import { tableReducer } from '../tableReducer';
import { getNumberOfPages, recalculatePage } from '../util';
import useDidUpdateEffect from './useDidUpdateEffect';
import { SortOrder } from '../types';
import type {
	Action,
	TableState,
	TableColumn,
	AllRowsAction,
	SingleRowAction,
	RangeRowAction,
	SortAction,
	SortColumn,
} from '../types';

interface UseTableStateProps<T> {
	data: T[];
	keyField: string;
	defaultSortColumn: TableColumn<T>;
	defaultSortDirection: SortOrder;
	paginationDefaultPage: number;
	paginationPerPage: number;
	paginationServer: boolean;
	paginationServerOptions: {
		persistSelectedOnSort?: boolean;
		persistSelectedOnPageChange?: boolean;
	};
	paginationTotalRows: number;
	pagination: boolean;
	selectableRowsSingle: boolean;
	selectableRowsVisibleOnly: boolean;
	selectableRowSelected: ((row: T) => boolean) | null;
	clearSelectedRows: boolean;
	paginationPage?: number;
	paginationResetDefaultPage: boolean;
	/** Controlled selection. When provided, internal selection state is overridden. */
	controlledSelectedRows?: T[];
	onSelectedRowsChange: (state: { allSelected: boolean; selectedCount: number; selectedRows: T[] }) => void;
	onSort: (
		selectedColumn: TableColumn<T>,
		sortDirection: SortOrder,
		sortedRows: T[],
		sortColumns: SortColumn<T>[],
	) => void;
	onChangePage: (page: number, totalRows: number) => void;
	onChangeRowsPerPage: (currentRowsPerPage: number, currentPage: number) => void;
}

interface UseTableStateReturn<T> {
	// State
	tableState: TableState<T>;
	// Actions
	handleSort: (action: SortAction<T>) => void;
	handleSelectAllRows: (action: AllRowsAction<T>) => void;
	handleSelectedRow: (action: SingleRowAction<T>) => void;
	handleSelectedRange: (action: RangeRowAction<T>) => void;
	handleChangePage: (page: number) => void;
	handleChangeRowsPerPage: (newRowsPerPage: number, tableRowsLength: number) => void;
	handleClearSelectedRows: () => void;
	handleClearSort: () => void;
}

/**
 *  hook to manage table state (selection, sorting, pagination)
 */
export default function useTableState<T>(props: UseTableStateProps<T>): UseTableStateReturn<T> {
	const {
		data,
		keyField,
		defaultSortColumn,
		defaultSortDirection,
		paginationDefaultPage,
		paginationPerPage,
		paginationServer,
		paginationServerOptions,
		paginationTotalRows,
		pagination,
		selectableRowsSingle,
		selectableRowsVisibleOnly,
		selectableRowSelected,
		clearSelectedRows,
		paginationPage,
		paginationResetDefaultPage,
		controlledSelectedRows,
		onSelectedRowsChange,
		onChangePage,
		onChangeRowsPerPage,
	} = props;

	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort);

	const hasDefaultSort = defaultSortColumn.id != null || !!defaultSortColumn.selector;

	const [tableState, dispatch] = React.useReducer<React.Reducer<TableState<T>, Action<T>>>(tableReducer, {
		allSelected: false,
		selectedCount: 0,
		selectedRows: [],
		selectedColumn: defaultSortColumn,
		toggleOnSelectedRowsChange: false,
		sortDirection: defaultSortDirection,
		sortColumns: hasDefaultSort ? [{ column: defaultSortColumn, sortDirection: defaultSortDirection }] : [],
		currentPage: paginationDefaultPage,
		rowsPerPage: paginationPerPage,
		selectedRowsFlag: false,
		sortTriggeredPageReset: false,
	});

	const handleClearSelectedRows = React.useCallback(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: false });
	}, []);

	const handleClearSort = React.useCallback(() => {
		dispatch({ type: 'CLEAR_SORT', defaultSortColumn, defaultSortDirection });
	}, [defaultSortColumn, defaultSortDirection]);

	const handleSort = React.useCallback((action: SortAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectAllRows = React.useCallback((action: AllRowsAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectedRow = React.useCallback((action: SingleRowAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectedRange = React.useCallback((action: RangeRowAction<T>) => {
		dispatch(action);
	}, []);

	const handleChangePage = React.useCallback(
		(page: number) => {
			dispatch({
				type: 'CHANGE_PAGE',
				page,
				paginationServer,
				visibleOnly: selectableRowsVisibleOnly,
				persistSelectedOnPageChange,
			});
		},
		[paginationServer, persistSelectedOnPageChange, selectableRowsVisibleOnly],
	);

	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number, tableRowsLength: number) => {
			const rowCount = paginationTotalRows || tableRowsLength;
			const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
			const recalculatedPage = recalculatePage(tableState.currentPage, updatedPage);

			// update the currentPage for client-side pagination
			// server-side should be handled by onChangeRowsPerPage callback
			if (!paginationServer) {
				handleChangePage(recalculatedPage);
			}

			dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
		},
		[tableState.currentPage, paginationServer, paginationTotalRows, handleChangePage],
	);

	// Effect: Notify parent of selection changes
	useDidUpdateEffect(() => {
		onSelectedRowsChange({
			allSelected: tableState.allSelected,
			selectedCount: tableState.selectedCount,
			selectedRows: tableState.selectedRows.slice(0),
		});
	}, [tableState.toggleOnSelectedRowsChange]);

	// Effect: Notify parent of page changes.
	// Guard: when currentPage was reset by SORT_CHANGE, onSort is the authoritative
	// callback — suppress onChangePage so the consumer doesn't double-fetch.
	useDidUpdateEffect(() => {
		if (!tableState.sortTriggeredPageReset) {
			onChangePage(tableState.currentPage, paginationTotalRows || data.length);
		}
	}, [tableState.currentPage]);

	// Effect: Notify parent of rows per page changes
	useDidUpdateEffect(() => {
		onChangeRowsPerPage(tableState.rowsPerPage, tableState.currentPage);
	}, [tableState.rowsPerPage]);

	// Effect: Handle pagination default page reset
	useDidUpdateEffect(() => {
		handleChangePage(paginationDefaultPage);
	}, [paginationDefaultPage, paginationResetDefaultPage]);

	// Effect: Handle controlled page prop
	useDidUpdateEffect(() => {
		if (paginationPage !== undefined) {
			handleChangePage(paginationPage);
		}
	}, [paginationPage]);

	// Effect: Recalculate page when total rows change (server pagination)
	useDidUpdateEffect(() => {
		if (pagination && paginationServer && paginationTotalRows > 0) {
			const updatedPage = getNumberOfPages(paginationTotalRows, tableState.rowsPerPage);
			const recalculatedPage = recalculatePage(tableState.currentPage, updatedPage);

			if (tableState.currentPage !== recalculatedPage) {
				handleChangePage(recalculatedPage);
			}
		}
	}, [paginationTotalRows]);

	// Effect: Clear selected rows when flag changes
	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [selectableRowsSingle, clearSelectedRows]);

	// Effect: Pre-select rows based on selectableRowSelected callback
	React.useEffect(() => {
		if (!selectableRowSelected) {
			return;
		}

		const preSelectedRows = data.filter(row => selectableRowSelected(row));
		const selected = selectableRowsSingle ? preSelectedRows.slice(0, 1) : preSelectedRows;

		dispatch({
			type: 'SELECT_MULTIPLE_ROWS',
			keyField,
			selectedRows: selected,
			totalRows: data.length,
			mergeSelections,
		});
		// We only want to update when data changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	// Controlled-selection override: if the parent passes selectedRows, that wins over
	// internal state. We still keep dispatching reducer actions so onSelectedRowsChange
	// fires with the user-intended new selection — the parent is then expected to
	// reflect that back via the controlled prop.
	const effectiveTableState: TableState<T> = controlledSelectedRows
		? {
				...tableState,
				selectedRows: controlledSelectedRows,
				selectedCount: controlledSelectedRows.length,
				allSelected: controlledSelectedRows.length > 0 && controlledSelectedRows.length === (data?.length ?? 0),
			}
		: tableState;

	return {
		tableState: effectiveTableState,
		handleSort,
		handleSelectAllRows,
		handleSelectedRow,
		handleSelectedRange,
		handleChangePage,
		handleChangeRowsPerPage,
		handleClearSelectedRows,
		handleClearSort,
	};
}
