import { getProperty, insertItem, isRowSelected, removeItem } from './util';
import { Action, RowRecord, TableState } from './types';
import { STATUS_CODES } from 'node:http';

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
			const { keyField, row, isSelected, rowCount } = action;

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

		case 'FILTER_CHANGE': {
			const { filterText, selectedColumn } = action
			let rows = state.rows
			const keyName = selectedColumn.name?.toString() || selectedColumn.id?.toString() || "noname"
			let filterState = { ...state.filters }
			if (!filterText && keyName in filterState) {
				delete filterState[keyName]
			} else {
				filterState = { ...filterState, [keyName]: { column: selectedColumn, value: filterText } }
			}
			if (!state.filterActive) {
				state.allRows = rows;
				state.filterActive = true;
			}
			if (Object.keys(filterState).length === 0) {
				state.filterActive = false;
				rows = state.allRows
			}
			if (state.filterActive && !action.filterServer) {		//
				rows = state.allRows.filter((row,idx) => Object.entries(filterState)  //
					.reduce((acc: boolean, [_, { column, value }]) =>
						(new RegExp(`.*${value}.*`, 'i')).test(getProperty(row,column.selector,null,idx)?.toString() ?? "") ? acc : false, true))
			}
			return { ...state, rows, filters: filterState }
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
