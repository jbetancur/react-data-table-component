import { insertItem, removeItem } from './util';

export const handleSelectAll = (rows, allChecked, checkboxStatusSelector) => {
  const allSelected = !allChecked;
  const activeSelectedRows = rows.filter(row => row[checkboxStatusSelector] !== false);

  return {
    allSelected,
    selectedCount: allSelected ? activeSelectedRows.length : 0,
    selectedRows: allSelected ? activeSelectedRows : [],
  };
};

export const handleRowSelected = (rows, row, selectedRows, checkboxStatusSelector) => {
  const activeSelectedRows = rows.filter(rowItem => rowItem[checkboxStatusSelector] !== false);

  if (selectedRows.find(r => r === row)) {
    return {
      selectedCount: selectedRows.length > 0 ? selectedRows.length - 1 : 0,
      allSelected: false,
      selectedRows: removeItem(selectedRows, row),
    };
  }

  return {
    selectedCount: selectedRows.length + 1,
    allSelected: selectedRows.length + 1 === activeSelectedRows.length,
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
