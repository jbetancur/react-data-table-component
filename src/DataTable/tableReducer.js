import { insertItem, removeItem } from './util';

export function tableReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ALL_ROWS': {
      const { rows } = action;
      const allChecked = !state.allSelected;

      return {
        ...state,
        allSelected: allChecked,
        selectedCount: allChecked ? rows.length : 0,
        selectedRows: allChecked ? rows : [],
      };
    }

    case 'SELECT_SINGLE_ROW': {
      const { row, rows, isRowSelected, keyField } = action;

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
        allSelected: state.selectedRows.length + 1 === rows.length,
        selectedRows: insertItem(state.selectedRows, row),
      };
    }

    case 'SELECT_MULTIPLE_ROWS': {
      const { selectedRows, rows } = action;

      return {
        ...state,
        selectedCount: selectedRows.length,
        allSelected: selectedRows.length === rows.length,
        selectedRows,
      };
    }

    case 'SORT_CHANGE': {
      const { sortColumn, sortDirection, sortServer, selectedColumn, pagination, paginationServer, visibleOnly } = action;
      const clearSelectedOnSort = (pagination && paginationServer) || sortServer || visibleOnly;

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
      const { page, paginationServer, visibleOnly } = action;
      const clearSelectedOnPage = paginationServer || visibleOnly;

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
