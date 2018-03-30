import shortid from 'shortid';
import orderBy from 'lodash/orderBy';
import { insertItem, removeItem, determineExpanderRowIdentifier, pull } from './util';

export const handleSelectAll = state => {
  const allSelected = !state.allSelected;

  return {
    allSelected,
    selectedCount: allSelected ? state.rows.length : 0,
    selectedRows: allSelected ? state.rows : [],
  };
};

export const handleRowChecked = (row, state) => {
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

export const toggleExpand = ({ keyField, expanderStateField }, row, state) => {
  const identifier = determineExpanderRowIdentifier(row, keyField);
  const expandedRow = state.rows.find(r => r[expanderStateField] && r.parent === identifier);

  if (expandedRow) {
    return {
      rows: removeItem(state.rows, expandedRow),
    };
  }

  const parentRowIndex = state.rows.findIndex(r => r === row);

  return {
    // insert a new expander row
    rows: insertItem(state.rows, {
      [keyField]: shortid.generate(),
      parent: identifier,
      [expanderStateField]: true,
    }, parentRowIndex + 1),
  };
};

export const handleSort = ({ expandableRows, expanderStateField }, selector, sortable, state) => {
  if (sortable) {
    const { sortDirection, rows } = state;
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    const handleRows = () => {
      if (expandableRows) {
        const removedExpands = pull(rows, rows.filter(r => r[expanderStateField]));

        return orderBy(removedExpands, selector, direction);
      }

      return orderBy(rows, selector, direction);
    };

    return {
      sortColumn: selector,
      sortDirection: direction,
      rows: handleRows(),
    };
  }

  return { ...state };
};

export const clearSelectedRows = () => ({
  allSelected: false,
  selectedCount: 0,
  selectedRows: [],
});
