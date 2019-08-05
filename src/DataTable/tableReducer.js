import { insertItem, removeItem } from './util';

export function tableReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ALL': {
      const allChecked = !state.allSelected;
      const selectedRows = action.rows.filter(({ disabled = false }) => !disabled);

      return {
        ...state,
        allSelected: allChecked,
        selectedCount: allChecked ? selectedRows.length : 0,
        selectedRows: allChecked ? selectedRows : [],
      };
    }

    case 'SORT_CHANGE': {
      const { sortColumn, sortDirection, selectedColumn, pagination, paginationServer } = action;

      return {
        ...state,
        sortColumn,
        selectedColumn,
        sortDirection,
        currentPage: 1,
        // when using server-side paging reset selected row counts when sorting
        ...pagination && paginationServer && ({
          allSelected: false,
          selectedCount: 0,
          selectedRows: [],
        }),
      };
    }

    case 'ROW_SELECTED': {
      const { row } = action;

      if (state.selectedRows.find(r => r === row)) {
        return {
          ...state,
          selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
          allSelected: false,
          selectedRows: removeItem(state.selectedRows, row),
        };
      }

      return {
        ...state,
        selectedCount: state.selectedRows.length + 1,
        allSelected: state.selectedRows.length + 1 === action.rows.length,
        selectedRows: insertItem(state.selectedRows, row),
      };
    }

    case 'CHANGE_PAGE': {
      const { page, paginationServer } = action;
      return {
        ...state,
        currentPage: page,
        // when using server-side paging reset selected row counts
        ...paginationServer && ({
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
