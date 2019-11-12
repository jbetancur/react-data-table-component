import shortid from 'shortid';
import orderBy from 'lodash/orderBy';

export const sort = (rows, field = '', direction, sortFn) => {
  if (sortFn && typeof sortFn === 'function') {
    return sortFn(rows, field, direction);
  }

  return orderBy(rows, field, direction);
};

export const getProperty = (row, selector, format) => {
  if (typeof selector !== 'string') {
    throw new Error('selector must be a . delimted string eg (my.property)');
  }

  if (format && typeof format === 'function') {
    return format(row);
  }

  return selector.split('.').reduce((acc, part) => {
    if (!acc) {
      return null;
    }

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

export const insertItem = (array, item, index = 0) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];

export const removeItem = (array, item) => {
  const newArray = array.slice();
  newArray.splice(newArray.findIndex(a => a === item), 1);

  return newArray;
};

// Make sure columns have unique id's
export const decorateColumns = columns => columns.map(column => ({ id: shortid.generate(), ...column }));

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
