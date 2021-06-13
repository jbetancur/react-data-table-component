import { insertItem, isRowSelected, removeItem } from './util';
import { Action, RowRecord, TableState } from './types';

export function tableReducer<T extends RowRecord>(state: TableState<T>, action: Action<T>): TableState<T> {
	switch (action.type) {
		case 'UPDATE_ROWS': {
			const { rows } = action;

			return {
				...state,
				rows,
			};
		}

		case 'SELECT_ALL_ROWS': {
			const { keyField, rows, rowCount, mergeSelections } = action;
			const allChecked = !state.allSelected;

			if (mergeSelections) {
				const selections = allChecked
					? [...state.selectedRows, ...rows.filter(row => !isRowSelected(row, state.selectedRows, keyField))]
					: state.selectedRows.filter(row => !isRowSelected(row, rows, keyField));

				return {
					...state,
					allSelected: allChecked,
					selectedCount: selections.length,
					selectedRows: selections,
				};
			}

			return {
				...state,
				allSelected: allChecked,
				selectedCount: allChecked ? rowCount : 0,
				selectedRows: allChecked ? rows : [],
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
					};
				}

				return {
					...state,
					selectedCount: 1,
					allSelected: false,
					selectedRows: insertItem([], row),
				};
			}

			// handlesmulti select mode
			if (isSelected) {
				return {
					...state,
					selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
					allSelected: false,
					selectedRows: removeItem(state.selectedRows, row, keyField),
				};
			}

			return {
				...state,
				selectedCount: state.selectedRows.length + 1,
				allSelected: state.selectedRows.length + 1 === rowCount,
				selectedRows: insertItem(state.selectedRows, row),
			};
		}

		case 'SELECT_MULTIPLE_ROWS': {
			const { keyField, selectedRows, rows, mergeSelections } = action;

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
				};
			}

			return {
				...state,
				selectedCount: selectedRows.length,
				allSelected: selectedRows.length === rows.length,
				selectedRows,
			};
		}

		case 'SORT_CHANGE': {
			const {
				rows,
				sortDirection,
				sortServer,
				selectedColumn,
				pagination,
				paginationServer,
				visibleOnly,
				persistSelectedOnSort,
			} = action;
			const clearSelectedOnSort =
				(pagination && paginationServer && !persistSelectedOnSort) || sortServer || visibleOnly;

			return {
				...state,
				rows,
				selectedColumn,
				sortDirection,
				currentPage: 1,
				// when using server-side paging reset selected row counts when sorting
				...(clearSelectedOnSort && {
					allSelected: false,
					selectedCount: 0,
					selectedRows: [],
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

		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}
