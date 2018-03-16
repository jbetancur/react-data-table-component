import { getProperty, insertItem, removeItem, decorateColumns, countIfOne, getSortDirection } from '../util';

const row = Object.freeze({ id: 1, name: 'iamaname', properties: { nested: 'iamnesting' } });

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

describe('countIfOne', () => {
  test('should return 1 if true', () => {
    const count = countIfOne(true);

    expect(count).toBe(1);
  });

  test('countIfOne should return 0 if false', () => {
    const count = countIfOne();

    expect(count).toBe(0);
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
