import {
  sort,
  getProperty,
  insertItem,
  removeItem,
  decorateColumns,
  getSortDirection,
  handleFunctionProps,
} from '../util';

const row = Object.freeze({ id: 1, name: 'iamaname', properties: { nested: 'iamnesting' } });

describe('sort', () => {
  test('built in sort', () => {
    const rows = sort([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc');

    expect(rows[0].name).toEqual('vadar');
  });

  test('should handle a null field and not sort', () => {
    const rows = sort([{ name: 'luke' }, { name: 'vadar' }], null, 'desc');

    expect(rows[0].name).toEqual('luke');
  });

  test('custom sort should be called', () => {
    const mockSort = jest.fn();

    sort([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc', mockSort);

    expect(mockSort).toBeCalledWith([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc');
  });
});

describe('getProperty', () => {
  test('getProperty return an object when a selector is passed', () => {
    const property = getProperty(row, 'name');

    expect(property).toEqual('iamaname');
  });

  test('getProperty return an object when there is a nested selector', () => {
    const property = getProperty(row, 'properties.nested');

    expect(property).toEqual('iamnesting');
  });

  test('getProperty should handle when a format function is passed', () => {
    const property = getProperty(row, 'name', r => r.name.toUpperCase());

    expect(property).toEqual('IAMANAME');
  });

  test('getProperty should thrown an error if the selector is not a string', () => {
    expect(() => getProperty(row, { data: 'incorrect' })).toThrow();
  });
});

describe('insertItem', () => {
  test('should return the correct array items', () => {
    const array = insertItem([{ name: 'foo' }], { name: 'bar' });

    expect(array).toEqual([{ name: 'bar' }, { name: 'foo' }]);
  });
});

describe('removeItem', () => {
  test('should return the correct array items', () => {
    const array = removeItem([{ name: 'foo' }, { name: 'bar' }], { name: 'bar' });

    expect(array).toEqual([{ name: 'foo' }]);
  });
});

describe('decorateColumns', () => {
  test('should proeprty decorate columms', () => {
    const array = decorateColumns([{ name: 'foo' }, { name: 'bar' }]);

    expect(array[0]).toHaveProperty('id');
    expect(array[1]).toHaveProperty('id');
  });
});

describe('getSortDirection', () => {
  test('should return asc if true', () => {
    const direction = getSortDirection(true);

    expect(direction).toBe('asc');
  });

  test('countIfOne should return desc if false', () => {
    const direction = getSortDirection();

    expect(direction).toBe('desc');
  });
});

describe('handleFunctionProps', () => {
  test('should resolve the property if it is a function with indeterminate = true', () => {
    const prop = handleFunctionProps({ fakeProp: indeterminate => (indeterminate ? 'yay' : 'nay') }, true);

    expect(prop).toEqual({ fakeProp: 'yay' });
  });

  test('should resolve the property if it is a function with indeterminate = false', () => {
    const prop = handleFunctionProps({ fakeProp: indeterminate => (indeterminate ? 'yay' : 'nay') }, false);

    expect(prop).toEqual({ fakeProp: 'nay' });
  });

  test('should not need to resolve the property if it is not a function', () => {
    const prop = handleFunctionProps({ fakeProp: 'haha' });

    expect(prop).toEqual({ fakeProp: 'haha' });
  });
});
