import {
	isEmpty,
	sort,
	getProperty,
	insertItem,
	removeItem,
	decorateColumns,
	getSortDirection,
	handleFunctionProps,
	getConditionalStyle,
	isRowSelected,
	normalizePins,
	getPinnedOffsets,
	getPinnedTotalWidths,
} from '../util';
import { ConditionalStyles, SortOrder } from '../types';

const row = Object.freeze({
	id: 1,
	name: 'iamaname',
	properties: { nested: 'iamnesting', items: [{ id: 1, name: 'iamarrayname' }] },
});

type DataRow = {
	id?: number;
	name?: string;
	properties?: {
		nested: string;
		items: { id: number; name: string }[];
	};
};

describe('isEmpty', () => {
	test('if the value is a number return false', () => {
		expect(isEmpty(1)).toBe(false);
	});

	test('if the value is a string return true', () => {
		expect(isEmpty('1')).toBe(false);
	});

	test('if the value is a 0 return false', () => {
		expect(isEmpty(0)).toBe(false);
	});

	test('if the value is an empty string return true', () => {
		expect(isEmpty('')).toBe(true);
	});
});

describe('sort', () => {
	test('built in sort when already sorted asc', () => {
		const rows = sort([{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }], row => row.name, SortOrder.ASC);

		expect(rows[0].name).toEqual('anakin');
		expect(rows[rows.length - 1].name).toEqual('vadar');
	});

	test('built in sort when already sorted desc', () => {
		const rows = sort([{ name: 'vadar' }, { name: 'leia' }, { name: 'anakin' }], row => row.name, SortOrder.DESC);

		expect(rows[0].name).toEqual('vadar');
		expect(rows[rows.length - 1].name).toEqual('anakin');
	});

	test('built in sort when desc', () => {
		const rows = sort([{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }], row => row.name, SortOrder.DESC);

		expect(rows[0].name).toEqual('vadar');
		expect(rows[rows.length - 1].name).toEqual('anakin');
	});

	test('built in sort when asc', () => {
		const rows = sort([{ name: 'vadar' }, { name: 'leia' }, { name: 'anakin' }], row => row.name, SortOrder.ASC);

		expect(rows[0].name).toEqual('anakin');
		expect(rows[rows.length - 1].name).toEqual('vadar');
	});

	test('built in sort when a value is not a string and asc', () => {
		const rows = sort([{ count: 20 }, { count: 10 }, { count: 1 }], row => row.count, SortOrder.ASC);

		expect(rows[0].count).toEqual(1);
		expect(rows[rows.length - 1].count).toEqual(20);
	});

	test('built in sort when a value is not a string and desc', () => {
		const rows = sort([{ count: 1 }, { count: 10 }, { count: 20 }], row => row.count, SortOrder.DESC);

		expect(rows[0].count).toEqual(20);
		expect(rows[rows.length - 1].count).toEqual(1);
	});

	test('built in sort nested keys', () => {
		const rows = sort(
			[{ item: { name: 'anakin' } }, { item: { name: 'leia' } }, { item: { name: 'vadar' } }],
			row => row.item.name,
			SortOrder.DESC,
		);

		expect(rows[0].item.name).toEqual('vadar');
		expect(rows[rows.length - 1].item.name).toEqual('anakin');
	});

	test('should handle a null field and not sort', () => {
		const rows = sort([{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }], null, SortOrder.DESC);

		expect(rows[0].name).toEqual('anakin');
		expect(rows[rows.length - 1].name).toEqual('vadar');
	});

	test('custom sort should be called', () => {
		const mockSort = vi.fn();
		const mockSelector = (row: { name: string }) => row.name;

		sort([{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }], mockSelector, SortOrder.DESC, mockSort);

		expect(mockSort).toBeCalledWith(
			[{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }],
			mockSelector,
			SortOrder.DESC,
		);
	});
});

describe('getProperty', () => {
	test('getProperty return null if a selector is null or undefined', () => {
		const property = getProperty(row, null, null, 0);

		expect(property).toEqual(null);
	});

	test('getProperty return a value when a string selector is passed', () => {
		const property = getProperty(row, row => row.name, null, 0);

		expect(property).toEqual('iamaname');
	});

	test('getProperty sreturn a value when a string selector is an function', () => {
		const property = getProperty(row, (r: { name: string }) => r.name, null, 0);

		expect(property).toEqual('iamaname');
	});

	test('getProperty should handle when a format function is passed', () => {
		const property = getProperty(
			row,
			row => row.name,
			r => r.name.toUpperCase(),
			0,
		);

		expect(property).toEqual('IAMANAME');
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
		const array = removeItem(
			[
				{ id: 1, name: 'foo' },
				{ id: 2, name: 'bar' },
			],
			{ id: 2, name: 'bar' },
			'id',
		);

		expect(array).toEqual([{ id: 1, name: 'foo' }]);
	});

	test('should return the correct array items when no keyfield is provided', () => {
		const array = removeItem([{ name: 'foo' }, { name: 'bar' }], { name: 'bar' });

		expect(array).toEqual([{ name: 'foo' }]);
	});

	test('should fallback to reference check is the keyField is mismatched', () => {
		const array = removeItem(
			[
				{ id: 1, name: 'foo' },
				{ id: 2, name: 'bar' },
			],
			{ id: 2, name: 'bar' },
			'UUID',
		);

		expect(array).toEqual([{ id: 1, name: 'foo' }]);
	});
});

describe('decorateColumns', () => {
	test('should decorate columms', () => {
		const array = decorateColumns([{ name: 'foo' }, { name: 'bar' }]);

		expect(array[0]).toHaveProperty('id');
		expect(array[1]).toHaveProperty('id');
	});
});

describe('getSortDirection', () => {
	test('should return asc if true', () => {
		const direction = getSortDirection(true);

		expect(direction).toBe(SortOrder.ASC);
	});

	test('countIfOne should return desc if false', () => {
		const direction = getSortDirection();

		expect(direction).toBe(SortOrder.DESC);
	});
});

describe('handleFunctionProps', () => {
	test('should resolve the property if it is a function with indeterminate = true', () => {
		const prop = handleFunctionProps({ fakeProp: (indeterminate: boolean) => (indeterminate ? 'yay' : 'nay') }, true);

		expect(prop).toEqual({ fakeProp: 'yay' });
	});

	test('should resolve the property if it is a function with indeterminate = false', () => {
		const prop = handleFunctionProps({ fakeProp: (indeterminate: boolean) => (indeterminate ? 'yay' : 'nay') }, false);

		expect(prop).toEqual({ fakeProp: 'nay' });
	});

	test('should not need to resolve the property if it is not a function', () => {
		const prop = handleFunctionProps({ fakeProp: 'haha' });

		expect(prop).toEqual({ fakeProp: 'haha' });
	});
});

describe('getConditionalStyle', () => {
	test('should return a row style if the expression matches', () => {
		const rowStyleExpression: ConditionalStyles<DataRow>[] = [
			{
				when: r => r.name === 'luke',
				style: {
					backgroundColor: 'green',
				},
			},
		];
		const { conditionalStyle } = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

		expect(conditionalStyle).toEqual({ backgroundColor: 'green' });
	});

	test('should return {} if the expression does not match', () => {
		const rowStyleExpression: ConditionalStyles<DataRow>[] = [
			{
				when: r => r.name === 'wookie',
				style: {
					backgroundColor: 'green',
				},
			},
		];
		const { conditionalStyle } = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

		expect(conditionalStyle).toEqual({});
	});

	test('should return {} if there are no style object expressions', () => {
		const rowStyleExpression: ConditionalStyles<DataRow>[] = [];

		const { conditionalStyle } = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

		expect(conditionalStyle).toEqual({});
	});

	test('should default to an empty object if the style property is not provided', () => {
		const rowStyleExpression: ConditionalStyles<DataRow>[] = [
			{
				when: r => r.name === 'luke',
			},
		];

		const { conditionalStyle } = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

		expect(conditionalStyle).toEqual({});
	});

	test('should return "" if there are no classNames', () => {
		const { classNames } = getConditionalStyle({ name: 'luke' }, []);

		expect(classNames).toEqual('');
	});

	test('should return "leia" a base class is provided', () => {
		const { classNames } = getConditionalStyle({ name: 'luke' }, [], ['leia']);

		expect(classNames).toEqual('leia');
	});

	test('should return "anakin leia" if the expression matches and a base class is provided', () => {
		const rowStyleExpression: ConditionalStyles<DataRow>[] = [
			{
				when: r => r.name === 'luke',
				classNames: ['leia'],
			},
		];

		const { classNames } = getConditionalStyle({ name: 'luke' }, rowStyleExpression, ['anakin']);

		expect(classNames).toEqual('anakin leia');
	});
});

describe('normalizePins', () => {
	const c = (id: number, pinned?: 'left' | 'right') =>
		({ id, name: String(id), pinned }) as { id: number; name: string; pinned?: 'left' | 'right' };

	test('returns cols unchanged when nothing is pinned', () => {
		const cols = [c(1), c(2), c(3)];
		expect(normalizePins(cols)).toEqual(cols);
	});

	test('keeps left-pinned columns pinned after reorder preserving count', () => {
		// [L, A, B] — 1 left pin — reorder to [A, L, B]; normalizePins should keep first 1 as left
		const cols = [c(2), c(1, 'left'), c(3)];
		const result = normalizePins(cols);
		expect(result[0].pinned).toBe('left');
		expect(result[1].pinned).toBeUndefined();
		expect(result[2].pinned).toBeUndefined();
	});

	test('keeps right-pinned columns pinned after reorder preserving count', () => {
		const cols = [c(1), c(3), c(2, 'right')];
		const result = normalizePins(cols);
		expect(result[2].pinned).toBe('right');
		expect(result[0].pinned).toBeUndefined();
	});

	test('reassigns pin when a non-pinned column is moved into the left-pin zone', () => {
		// Originally 1 left pin; after move, position 0 is now an ex-unpinned column
		const cols = [c(2), c(1, 'left'), c(3)]; // 1 left, 0 right
		const result = normalizePins(cols);
		expect(result[0].pinned).toBe('left'); // col2 now becomes left-pinned
		expect(result[1].pinned).toBeUndefined();
	});

	test('unpins a column moved out of the left-pin zone', () => {
		// 1 left pin (id=1) moved to last position → should become unpinned
		const cols = [c(2), c(3), c(1, 'left')]; // 1 left pin but now at end
		const result = normalizePins(cols);
		expect(result[0].pinned).toBe('left');
		expect(result[1].pinned).toBeUndefined();
		expect(result[2].pinned).toBeUndefined();
	});

	test('handles both left and right pins simultaneously', () => {
		const cols = [c(1, 'left'), c(2), c(3), c(4, 'right')];
		const result = normalizePins(cols);
		expect(result[0].pinned).toBe('left');
		expect(result[1].pinned).toBeUndefined();
		expect(result[2].pinned).toBeUndefined();
		expect(result[3].pinned).toBe('right');
	});
});

describe('getPinnedOffsets', () => {
	const col = (id: string | number, pinned?: 'left' | 'right', width = '100px') =>
		({ id, name: String(id), pinned, width }) as Parameters<typeof getPinnedOffsets>[0][number];

	test('returns empty offsets when no columns are pinned', () => {
		const result = getPinnedOffsets([col('a'), col('b')], {}, false, false, false);
		expect(result.left).toEqual({});
		expect(result.right).toEqual({});
	});

	test('computes left offsets for left-pinned columns', () => {
		const cols = [col('a', 'left', '100px'), col('b', 'left', '150px'), col('c')];
		const result = getPinnedOffsets(cols, {}, false, false, false);
		expect(result.left['a']).toBe(0);
		expect(result.left['b']).toBe(100);
	});

	test('accounts for selectable rows prefix width', () => {
		const cols = [col('a', 'left', '100px')];
		const result = getPinnedOffsets(cols, {}, true, false, false);
		expect(result.left['a']).toBe(48);
	});

	test('computes right offsets for right-pinned columns', () => {
		const cols = [col('a'), col('b', 'right', '120px'), col('c', 'right', '80px')];
		const result = getPinnedOffsets(cols, {}, false, false, false);
		// rightmost (c) gets offset 0, next (b) gets 80
		expect(result.right['c']).toBe(0);
		expect(result.right['b']).toBe(80);
	});

	test('uses columnWidths override when available', () => {
		const cols = [col('a', 'left', '100px'), col('b', 'left', '100px')];
		const result = getPinnedOffsets(cols, { a: 200 }, false, false, false);
		expect(result.left['a']).toBe(0);
		expect(result.left['b']).toBe(200);
	});

	test('omits omitted columns from offset calculation', () => {
		const cols = [{ ...col('a', 'left', '100px'), omit: true }, col('b', 'left', '100px')];
		const result = getPinnedOffsets(cols, {}, false, false, false);
		expect(result.left['a']).toBeUndefined();
		expect(result.left['b']).toBe(0);
	});
});

describe('getPinnedTotalWidths', () => {
	const col = (id: string | number, pinned?: 'left' | 'right', width = '100px') =>
		({ id, name: String(id), pinned, width }) as Parameters<typeof getPinnedTotalWidths>[0][number];

	test('returns zeros when nothing is pinned', () => {
		const result = getPinnedTotalWidths([col('a'), col('b')], {}, false, false, false);
		expect(result).toEqual({ left: 0, right: 0 });
	});

	test('sums left-pinned widths including prefix columns', () => {
		const cols = [col('a', 'left', '100px'), col('b', 'left', '150px'), col('c')];
		const result = getPinnedTotalWidths(cols, {}, true, false, false);
		// 48 (selectable) + 100 + 150 = 298
		expect(result.left).toBe(298);
		expect(result.right).toBe(0);
	});

	test('sums right-pinned widths', () => {
		const cols = [col('a'), col('b', 'right', '120px'), col('c', 'right', '80px')];
		const result = getPinnedTotalWidths(cols, {}, false, false, false);
		expect(result.right).toBe(200);
	});
});

describe('isRowSelected', () => {
	test('when there is a keyField in the data set', () => {
		const currentRow = { id: 2, name: 'vadar' };
		const selectedRows = [
			{ id: 1, name: 'luke' },
			{ id: 2, name: 'vadar' },
		];

		expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(true);
	});

	test('when the keyField is missing in the data set', () => {
		const selectedRows = [{ name: 'luke' }, { name: 'vadar' }];
		const currentRow = selectedRows[1];

		expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(true);
	});

	test('when the row is not selected', () => {
		const currentRow = { id: 3, name: 'leia' };
		const selectedRows = [
			{ id: 1, name: 'luke' },
			{ id: 2, name: 'vadar' },
		];

		expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(false);
	});
});
