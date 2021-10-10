import { insertItem, isRowSelected, removeItem } from './util';
import { Action, TableState } from './types';

export function tableReducer<T>(state: TableState<T>, action: Action<T>): TableState<T> {
	const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;

	switch (action.type) {
		case 'SELECT_ALL_ROWS': {
			const { keyField, rows, rowCount, mergeSelections } = action;
			const allChecked = !state.allSelected;
			const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;

			if (mergeSelections) {
				const selections = allChecked
					? [...state.selectedRows, ...rows.filter(row => !isRowSelected(row, state.selectedRows, keyField))]
					: state.selectedRows.filter(row => !isRowSelected(row, rows, keyField));

				return {
					...state,
					allSelected: allChecked,
					selectedCount: selections.length,
					selectedRows: selections,
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				allSelected: allChecked,
				selectedCount: allChecked ? rowCount : 0,
				selectedRows: allChecked ? rows : [],
				toggleOnSelectedRowsChange,
			};
		}

		case 'SELECT_SINGLE_ROW': {
			const { keyField, row, isSelected, rowCount, singleSelect } = action;

			// handle single select mode
			if (singleSelect) {
				if (isSelected) {
					return {
						...state,
						selectedCount: 0,
						allSelected: false,
						selectedRows: [],
						toggleOnSelectedRowsChange,
					};
				}

				return {
					...state,
					selectedCount: 1,
					allSelected: false,
					selectedRows: [row],
					toggleOnSelectedRowsChange,
				};
			}

			// handle multi select mode
			if (isSelected) {
				return {
					...state,
					selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
					allSelected: false,
					selectedRows: removeItem(state.selectedRows, row, keyField),
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				selectedCount: state.selectedRows.length + 1,
				allSelected: state.selectedRows.length + 1 === rowCount,
				selectedRows: insertItem(state.selectedRows, row),
				toggleOnSelectedRowsChange,
			};
		}

		case 'SELECT_MULTIPLE_ROWS': {
			const { keyField, selectedRows, totalRows, mergeSelections } = action;

			if (mergeSelections) {
				const selections = [
					...state.selectedRows,
					...selectedRows.filter(row => !isRowSelected(row, state.selectedRows, keyField)),
				];

				return {
					...state,
					selectedCount: selections.length,
					allSelected: false,
					selectedRows: selections,
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				selectedCount: selectedRows.length,
				allSelected: selectedRows.length === totalRows,
				selectedRows,
				toggleOnSelectedRowsChange,
			};
		}

		case 'CLEAR_SELECTED_ROWS': {
			const { selectedRowsFlag } = action;

			return {
				...state,
				allSelected: false,
				selectedCount: 0,
				selectedRows: [],
				selectedRowsFlag,
			};
		}

		case 'SORT_CHANGE': {
			const { sortDirection, selectedColumn, clearSelectedOnSort } = action;

			return {
				...state,
				selectedColumn,
				sortDirection,
				currentPage: 1,
				// when using server-side paging reset selected row counts when sorting
				...(clearSelectedOnSort && {
					allSelected: false,
					selectedCount: 0,
					selectedRows: [],
					toggleOnSelectedRowsChange,
				}),
			};
		}

		case 'CHANGE_PAGE': {
			const { page, paginationServer, visibleOnly, persistSelectedOnPageChange } = action;
			const mergeSelections = paginationServer && persistSelectedOnPageChange;
			const clearSelectedOnPage = (paginationServer && !persistSelectedOnPageChange) || visibleOnly;

			return {
				...state,
				currentPage: page,
				...(mergeSelections && {
					allSelected: false,
				}),
				// when using server-side paging reset selected row counts
				...(clearSelectedOnPage && {
					allSelected: false,
					selectedCount: 0,
					selectedRows: [],
					toggleOnSelectedRowsChange,
				}),
			};
		}

		case 'CHANGE_ROWS_PER_PAGE': {
			const { rowsPerPage, page } = action;

			return {
				...state,
				currentPage: page,
				rowsPerPage,
			};
		}
	}
}
