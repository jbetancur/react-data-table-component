import shortid from 'shortid';
import orderBy from 'lodash.orderby';

export const isEmpty = (field = '') => {
  return typeof field === 'undefined' || field === null || field.length === 0;
};

export const sort = (rows, field = '', direction, sortFn) => {
  if (sortFn && typeof sortFn === 'function') {
    return sortFn(rows, field, direction);
  }

  return orderBy(rows, field, direction);
};

export const getProperty = (row, selector, format) => {
  if (!selector) {
    return null;
  }

  if (typeof selector !== 'string' && typeof selector !== 'function') {
    throw new Error('selector must be a . delimited string eg (my.property) or function (e.g. row => row.field');
  }

  if (format && typeof format === 'function') {
    return format(row);
  }

  if (selector && typeof selector === 'function') {
    return selector(row);
  }

  return selector.split('.').reduce((acc, part) => {
    // O(n2) when querying for an array (e.g. items[0].name)
    // Likely, the object depth will be reasonable enough that performance is not a concern
    const arr = part.match(/[^\]\\[.]+/g);
    if (arr.length > 1) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < arr.length; i++) {
        return acc[arr[i]][arr[i + 1]];
      }
    }

    return acc[part];
  }, row);
};

export const insertItem = (array = [], item = {}, index = 0) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];

export const removeItem = (array = [], item = {}, keyField) => {
  const newArray = array.slice();

  if (item[keyField]) {
    newArray.splice(newArray.findIndex(a => a[keyField] === item[keyField]), 1);
  } else {
    newArray.splice(newArray.findIndex(a => a === item), 1);
  }

  return newArray;
};

// Make sure columns have unique id's
export const decorateColumns = columns => columns.map(column => ({
  id: shortid.generate(),
  ...column,
  sortable: column.sortable || !!column.sortFunction || undefined,
}));

export const getSortDirection = direction => (direction ? 'asc' : 'desc');

export const handleFunctionProps = (object, ...args) => {
  let newObject;

  Object.keys(object).map(o => object[o]).forEach((value, index) => {
    const oldObject = object;

    if (typeof value === 'function') {
      newObject = { ...oldObject, [Object.keys(object)[index]]: value(...args) };
      delete oldObject[value];
    }
  });

  return newObject || object;
};

export const getNumberOfPages = (rowCount, rowsPerPage) => Math.ceil(rowCount / rowsPerPage);

export const recalculatePage = (prevPage, nextPage) => Math.min(prevPage, nextPage);

export const noop = () => null;

export const getConditionalStyle = (row = {}, conditionalRowStyles = []) => {
  let rowStyle = {};

  if (conditionalRowStyles.length) {
    conditionalRowStyles.forEach(exp => {
      if (!exp.when || typeof exp.when !== 'function') {
        throw new Error('"when" must be defined in the conditional style object and must be function');
      }

      // evaluate the field and if true return a the style to be applied
      if (exp.when(row)) {
        rowStyle = exp.style || {};
      }
    });
  }

  return rowStyle;
};

export const isRowSelected = (row = {}, selectedRows = [], keyField = 'id') => {
  if (row[keyField]) {
    return selectedRows.some(r => r[keyField] === row[keyField]);
  }

  return selectedRows.some(r => r === row);
};

export const detectRTL = (direction = 'auto') => {
  if (direction === 'auto') {
    const canUse = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

    return canUse && (document.getElementsByTagName('BODY')[0] === 'rtl' || document.getElementsByTagName('HTML')[0].dir === 'rtl');
  }

  return direction === 'rtl';
};
