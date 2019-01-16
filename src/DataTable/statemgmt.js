import orderBy from 'lodash/orderBy';
import { insertItem, removeItem } from './util';

export const handleSelectAll = state => {
  const allSelected = !state.allSelected;

  return {
    allSelected,
    selectedCount: allSelected ? state.rows.length : 0,
    selectedRows: allSelected ? state.rows : [],
  };
};

export const handleRowSelected = (row, state) => {
  if (state.selectedRows.find(r => r === row)) {
    return {
      selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
      allSelected: false,
      selectedRows: removeItem(state.selectedRows, row),
    };
  }

  return {
    selectedCount: state.selectedRows.length + 1,
    allSelected: state.selectedRows.length + 1 === state.rows.length,
    selectedRows: insertItem(state.selectedRows, row),
  };
};

export const handleSort = (selector, sortable, state) => {
  if (sortable) {
    const { sortDirection, rows } = state;
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';

    return {
      sortColumn: selector,
      sortDirection: direction,
      rows: orderBy(rows, selector, direction),
    };
  }

  return { ...state };
};

export const clearSelected = clearedRowsFlag => ({
  allSelected: false,
  selectedCount: 0,
  selectedRows: [],
  clearSelectedRows: clearedRowsFlag,
});
