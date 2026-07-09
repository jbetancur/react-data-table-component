import {
	isEmpty,
	sort,
	multiSort,
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
	getPinnedCellMeta,
	getFirstRightPinnedId,
	getCellWidthProps,
	isEven,
	getPinZoneForIndex,
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

	test('still invokes a table-level sortFn with no field, so it can run in the "not sorted" state', () => {
		const mockSort = vi.fn(rows => rows);

		sort([{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }], null, SortOrder.DESC, mockSort);

		expect(mockSort).toHaveBeenCalledWith(
			[{ name: 'anakin' }, { name: 'leia' }, { name: 'vadar' }],
			expect.any(Function),
			SortOrder.DESC,
		);
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

describe('multiSort', () => {
	type Person = { dept: string; name: string; age: number };
	const people: Person[] = [
		{ dept: 'eng', name: 'Bob', age: 40 },
		{ dept: 'eng', name: 'Alice', age: 30 },
		{ dept: 'sales', name: 'Carol', age: 25 },
		{ dept: 'eng', name: 'Alice', age: 22 },
	];

	test('returns rows unchanged when there are no sort columns', () => {
		expect(multiSort(people, [])).toBe(people);
	});

	test('sorts by the primary column, then breaks ties with the secondary column', () => {
		const sorted = multiSort(people, [
			{ column: { id: 1, selector: r => r.dept }, sortDirection: SortOrder.ASC },
			{ column: { id: 2, selector: r => r.name }, sortDirection: SortOrder.ASC },
		]);

		expect(sorted.map(p => `${p.dept}:${p.name}`)).toEqual(['eng:Alice', 'eng:Alice', 'eng:Bob', 'sales:Carol']);
	});

	test('honors per-column direction independently', () => {
		const sorted = multiSort(people, [
			{ column: { id: 1, selector: r => r.dept }, sortDirection: SortOrder.ASC },
			{ column: { id: 2, selector: r => r.age }, sortDirection: SortOrder.DESC },
		]);

		expect(sorted.map(p => `${p.dept}:${p.age}`)).toEqual(['eng:40', 'eng:30', 'eng:22', 'sales:25']);
	});

	test('is stable — equal rows keep their original relative order', () => {
		const sorted = multiSort(people, [{ column: { id: 1, selector: r => r.dept }, sortDirection: SortOrder.ASC }]);
		const engNames = sorted.filter(p => p.dept === 'eng').map(p => `${p.name}:${p.age}`);

		expect(engNames).toEqual(['Bob:40', 'Alice:30', 'Alice:22']);
	});

	test('uses a column sortFunction when provided, flipping its result for desc', () => {
		const byAge = { id: 1, selector: (r: Person) => r.name, sortFunction: (a: Person, b: Person) => a.age - b.age };
		const asc = multiSort(people, [{ column: byAge, sortDirection: SortOrder.ASC }]);
		const desc = multiSort(people, [{ column: byAge, sortDirection: SortOrder.DESC }]);

		expect(asc.map(p => p.age)).toEqual([22, 25, 30, 40]);
		expect(desc.map(p => p.age)).toEqual([40, 30, 25, 22]);
	});

	test('falls through to the next sort column when a sortFunction ties', () => {
		const tiedByDept = { id: 1, selector: (r: Person) => r.dept, sortFunction: () => 0 };
		const byName = { id: 2, selector: (r: Person) => r.name };
		const sorted = multiSort(people, [
			{ column: tiedByDept, sortDirection: SortOrder.ASC },
			{ column: byName, sortDirection: SortOrder.ASC },
		]);

		expect(sorted.map(p => p.name)).toEqual(['Alice', 'Alice', 'Bob', 'Carol']);
	});

	test('falls through to the next sort column when a column has no selector', () => {
		const noSelector = { id: 1 };
		const byName = { id: 2, selector: (r: Person) => r.name };
		const sorted = multiSort(people, [
			{ column: noSelector, sortDirection: SortOrder.ASC },
			{ column: byName, sortDirection: SortOrder.ASC },
		]);

		expect(sorted.map(p => p.name)).toEqual(['Alice', 'Alice', 'Bob', 'Carol']);
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

	test('should throw if "when" is missing from the conditional style object', () => {
		const rowStyleExpression = [{ style: { backgroundColor: 'green' } }] as ConditionalStyles<DataRow>[];

		expect(() => getConditionalStyle({ name: 'luke' }, rowStyleExpression)).toThrow(
			'"when" must be defined in the conditional style object and must be function',
		);
	});

	test('should throw if "when" is not a function', () => {
		const rowStyleExpression = [
			{ when: true, style: { backgroundColor: 'green' } },
		] as unknown as ConditionalStyles<DataRow>[];

		expect(() => getConditionalStyle({ name: 'luke' }, rowStyleExpression)).toThrow(
			'"when" must be defined in the conditional style object and must be function',
		);
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

	test('uses the --rdt-system-col-width CSS variable when set', () => {
		document.documentElement.style.setProperty('--rdt-system-col-width', '64px');
		try {
			const cols = [col('a', 'left', '100px')];
			const result = getPinnedOffsets(cols, {}, true, false, false);
			expect(result.left['a']).toBe(64);
		} finally {
			document.documentElement.style.removeProperty('--rdt-system-col-width');
		}
	});

	test('falls back to the default system column width when the CSS variable is not a number', () => {
		document.documentElement.style.setProperty('--rdt-system-col-width', 'not-a-number');
		try {
			const cols = [col('a', 'left', '100px')];
			const result = getPinnedOffsets(cols, {}, true, false, false);
			expect(result.left['a']).toBe(48);
		} finally {
			document.documentElement.style.removeProperty('--rdt-system-col-width');
		}
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

describe('getPinnedCellMeta', () => {
	type R = { id: number };
	const offsets = { left: { a: 0, b: 100 }, right: { y: 80, z: 0 } };
	const col = (id: string | undefined, pinned?: 'left' | 'right'): Parameters<typeof getPinnedCellMeta<R>>[0] =>
		({ id, name: String(id), selector: r => r.id, pinned }) as Parameters<typeof getPinnedCellMeta<R>>[0];

	test('returns no pin state for an unpinned column', () => {
		const result = getPinnedCellMeta(col('c'), offsets);
		expect(result.pinnedLeft).toBe(false);
		expect(result.pinnedRight).toBe(false);
		expect(result.style).toEqual({});
		expect(result.className).toBe('');
	});

	test('flags the rightmost left-pinned column as isLastLeftPin', () => {
		const result = getPinnedCellMeta(col('b', 'left'), offsets);
		expect(result.pinnedLeft).toBe(true);
		expect(result.isLastLeftPin).toBe(true);
		expect(result.style).toEqual({ position: 'sticky', left: 100 });
		expect(result.className).toContain('rdt_pinLeft');
		expect(result.className).toContain('rdt_pinLeftLast');
	});

	test('does not flag inner left-pinned columns as isLastLeftPin', () => {
		const result = getPinnedCellMeta(col('a', 'left'), offsets);
		expect(result.isLastLeftPin).toBe(false);
		expect(result.className).toContain('rdt_pinLeft');
		expect(result.className).not.toContain('rdt_pinLeftLast');
	});

	test('flags the leftmost right-pinned column as isFirstRightPin', () => {
		const result = getPinnedCellMeta(col('y', 'right'), offsets);
		expect(result.pinnedRight).toBe(true);
		expect(result.isFirstRightPin).toBe(true);
		expect(result.style).toEqual({ position: 'sticky', right: 80 });
		expect(result.className).toContain('rdt_pinRight');
		expect(result.className).toContain('rdt_pinRightFirst');
	});

	test('returns empty meta when pinnedOffsets is undefined', () => {
		const result = getPinnedCellMeta(col('a', 'left'), undefined);
		expect(result.pinnedLeft).toBe(false);
		expect(result.style).toEqual({});
		expect(result.className).toBe('');
	});

	test('returns empty meta when column id is missing', () => {
		const result = getPinnedCellMeta(col(undefined, 'left'), offsets);
		expect(result.pinnedLeft).toBe(false);
		expect(result.className).toBe('');
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

describe('handleFunctionProps with multiple function props', () => {
	test('should resolve every function prop, not just the last one', () => {
		const result = handleFunctionProps(
			{
				first: (flag: boolean) => (flag ? 'a' : 'x'),
				second: (flag: boolean) => (flag ? 'b' : 'y'),
				plain: 'untouched',
			},
			true,
		);

		expect(result).toEqual({ first: 'a', second: 'b', plain: 'untouched' });
	});
});

describe('getFirstRightPinnedId', () => {
	type R = { id: number };
	const col = (id: string | number | undefined, pinned?: 'left' | 'right', omit = false) =>
		({ id, name: String(id), selector: (r: R) => r.id, pinned, omit }) as Parameters<
			typeof getFirstRightPinnedId<R>
		>[0][number];

	test('returns null when no column is right-pinned', () => {
		expect(getFirstRightPinnedId([col('a'), col('b', 'left')])).toBe(null);
	});

	test('returns the first right-pinned column id', () => {
		expect(getFirstRightPinnedId([col('a'), col('b', 'right'), col('c', 'right')])).toBe('b');
	});

	test('skips omitted columns', () => {
		expect(getFirstRightPinnedId([col('a'), col('b', 'right', true), col('c', 'right')])).toBe('c');
	});

	test('returns null when the first right-pinned column has no id', () => {
		expect(getFirstRightPinnedId([col(undefined, 'right')])).toBe(null);
	});
});

describe('getCellWidthProps', () => {
	type R = { id: number };
	const column = {
		id: 'a',
		name: 'a',
		selector: (r: R) => r.id,
		grow: 2,
		width: '150px',
		minWidth: '100px',
		maxWidth: '300px',
	};

	test('passes through column width props when there is no resized width', () => {
		expect(getCellWidthProps(column, undefined)).toEqual({
			grow: 2,
			width: '150px',
			minWidth: '100px',
			maxWidth: '300px',
		});
	});

	test('locks all width props to the resized width and zeroes grow', () => {
		expect(getCellWidthProps(column, 200)).toEqual({
			grow: 0,
			width: '200px',
			minWidth: '200px',
			maxWidth: '200px',
		});
	});
});

describe('getPinnedCellMeta with zIndex', () => {
	type R = { id: number };
	const offsets = { left: { a: 0 }, right: {} };
	const col = (pinned?: 'left' | 'right') =>
		({ id: 'a', name: 'a', selector: (r: R) => r.id, pinned }) as Parameters<typeof getPinnedCellMeta<R>>[0];

	test('includes zIndex in the sticky style when provided', () => {
		const result = getPinnedCellMeta(col('left'), offsets, 2);
		expect(result.style).toEqual({ position: 'sticky', left: 0, zIndex: 2 });
	});

	test('omits zIndex for unpinned columns', () => {
		const result = getPinnedCellMeta(col(), offsets, 2);
		expect(result.style).toEqual({});
	});
});

describe('isEven', () => {
	test('returns true for even numbers including zero', () => {
		expect(isEven(0)).toBe(true);
		expect(isEven(2)).toBe(true);
	});

	test('returns false for odd numbers', () => {
		expect(isEven(1)).toBe(false);
		expect(isEven(3)).toBe(false);
	});
});

describe('getPinZoneForIndex', () => {
	test('returns "left" when the index is within the left-pinned count', () => {
		expect(getPinZoneForIndex(0, 2, 1, 5)).toBe('left');
		expect(getPinZoneForIndex(1, 2, 1, 5)).toBe('left');
	});

	test('returns "right" when the index is within the right-pinned count', () => {
		expect(getPinZoneForIndex(4, 2, 1, 5)).toBe('right');
	});

	test('returns undefined when the index is not pinned', () => {
		expect(getPinZoneForIndex(2, 2, 1, 5)).toBeUndefined();
	});
});
