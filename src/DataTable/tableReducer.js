import { insertItem, removeItem } from './util';

export function tableReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ALL_ROWS': {
      const { rows, rowCount } = action;
      const allChecked = !state.allSelected;

      return {
        ...state,
        allSelected: allChecked,
        selectedCount: allChecked ? rowCount : 0,
        selectedRows: allChecked ? rows : [],
      };
    }

    case 'SELECT_SINGLE_ROW': {
      const { row, isRowSelected, keyField, rowCount } = action;

      if (isRowSelected) {
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
      const { selectedRows, rowCount, mergeSelections } = action;
      const selections = mergeSelections
        ? [...state.selectedRows, ...selectedRows.filter(row => !state.selectedRows.includes(row))]
        : selectedRows;

      return {
        ...state,
        selectedCount: selections.length,
        allSelected: selections.length === rowCount,
        selectedRows: selections,
      };
    }

    case 'SORT_CHANGE': {
      const { sortColumn, sortDirection, sortServer, selectedColumn, pagination, paginationServer, visibleOnly, persistSelectedOnSort } = action;
      const clearSelectedOnSort = (pagination && paginationServer && !persistSelectedOnSort) || sortServer || visibleOnly;

      return {
        ...state,
        sortColumn,
        selectedColumn,
        sortDirection,
        currentPage: 1,
        // when using server-side paging reset selected row counts when sorting
        ...clearSelectedOnSort && ({
          allSelected: false,
          selectedCount: 0,
          selectedRows: [],
        }),
      };
    }

    case 'CHANGE_PAGE': {
      const { page, paginationServer, visibleOnly, persistSelectedOnPageChange } = action;
      const clearSelectedOnPage = (paginationServer && !persistSelectedOnPageChange) || visibleOnly;

      return {
        ...state,
        currentPage: page,
        // when using server-side paging reset selected row counts
        ...clearSelectedOnPage && ({
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
