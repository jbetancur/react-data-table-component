import { insertItem, removeItem } from './util';

export const handleSelectAll = (rows, allChecked) => {
  const allSelected = !allChecked;

  return {
    allSelected,
    selectedCount: allSelected ? rows.length : 0,
    selectedRows: allSelected ? rows : [],
  };
};

export const handleRowSelected = (rows, row, selectedRows) => {
  if (selectedRows.find(r => r === row)) {
    return {
      selectedCount: selectedRows.length > 0 ? selectedRows.length - 1 : 0,
      allSelected: false,
      selectedRows: removeItem(selectedRows, row),
    };
  }

  return {
    selectedCount: selectedRows.length + 1,
    allSelected: selectedRows.length + 1 === rows.length,
    selectedRows: insertItem(selectedRows, row),
  };
};

export const handleSort = (selector, sortable, state) => {
  if (sortable) {
    const { sortDirection, sortColumn } = state;
    let direction = sortDirection;

    // change sort direction only if sortColumn (currently selected column) is === the newly clicked column
    // otherwise, retain sort direction if the column is swiched
    if (sortColumn === selector) {
      direction = sortDirection === 'asc'
        ? 'desc'
        : 'asc';
    }

    return {
      sortColumn: selector,
      sortDirection: direction,
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
