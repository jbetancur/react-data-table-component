import shortid from 'shortid';

export const getProperty = (row, selector, format) => {
  if (typeof selector !== 'string') {
    throw new Error('selector must be a . delimted string eg (my.property)');
  }

  if (format && typeof format === 'function') {
    return format(row);
  }

  return selector.split('.').reduce((acc, part) => acc && acc[part], row);
};

// eslint-disable-next-line arrow-body-style
export const determineExpanderRowIdentifier = (row, keyField) => {
  return row[keyField] ? row[keyField] : row;
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

export const countIfOne = item => (item ? 1 : 0);

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
