import { insertItem, removeItem } from './util';

export function tableReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ALL': {
      const { data } = state;
      const allChecked = !state.allSelected;

      return {
        ...state,
        allSelected: allChecked,
        selectedCount: allChecked ? data.length : 0,
        selectedRows: allChecked ? data : [],
      };
    }

    case 'SORT_CHANGE': {
      const { sortColumn, sortDirection, selectedColumn } = action;

      return {
        ...state,
        sortColumn,
        selectedColumn,
        sortDirection,
      };
    }

    case 'ROW_SELECTED': {
      const { selectedRows, data } = state;
      const { row } = action;

      if (selectedRows.find(r => r === row)) {
        return {
          ...state,
          selectedCount: selectedRows.length > 0 ? selectedRows.length - 1 : 0,
          allSelected: false,
          selectedRows: removeItem(selectedRows, row),
        };
      }

      return {
        ...state,
        selectedCount: selectedRows.length + 1,
        allSelected: selectedRows.length + 1 === data.length,
        selectedRows: insertItem(selectedRows, row),
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
