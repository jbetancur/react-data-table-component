import { insertItem, removeItem } from './util';

export function tableReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ALL': {
      const allChecked = !state.allSelected;

      return {
        ...state,
        allSelected: allChecked,
        selectedCount: allChecked ? state.data.length : 0,
        selectedRows: allChecked ? state.data : [],
      };
    }

    case 'SORT_CHANGE': {
      const { sortColumn, sortDirection, selectedColumn } = action;

      return {
        ...state,
        sortColumn,
        selectedColumn,
        sortDirection,
        currentPage: 1,
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
        allSelected: state.selectedRows.length + 1 === state.data.length,
        selectedRows: insertItem(state.selectedRows, row),
      };
    }

    case 'CHANGE_PAGE': {
      return {
        ...state,
        currentPage: action.page,
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
