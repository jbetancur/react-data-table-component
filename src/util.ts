import { SortOrder } from './types';
import type { CSSObject, ConditionalStyles, TableColumn, Format, TableRow, Selector, SortFunction } from './types';

function isPlainObject(val: unknown): val is Record<string, unknown> {
	return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function mergeDeep<T extends object>(target: T, source: Partial<T>): T {
	const output = { ...target };
	for (const key of Object.keys(source) as (keyof T)[]) {
		const srcVal = source[key];
		const tgtVal = output[key];
		if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
			output[key] = mergeDeep(tgtVal as object, srcVal as object) as T[keyof T];
		} else if (srcVal !== undefined) {
			output[key] = srcVal as T[keyof T];
		}
	}
	return output;
}

export function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}

export function isEmpty(field: string | number | undefined = ''): boolean {
	if (typeof field === 'number') {
		return false;
	}

	return !field || field.length === 0;
}

export function sort<T>(
	rows: T[],
	selector: Selector<T> | null | undefined,
	direction: SortOrder,
	sortFn?: SortFunction<T> | null,
): T[] {
	if (!selector) {
		return rows;
	}

	if (sortFn && typeof sortFn === 'function') {
		// we must create a new rows reference
		return sortFn(rows.slice(0), selector, direction);
	}

	return rows.slice(0).sort((a: T, b: T) => {
		const aValue = selector(a);
		const bValue = selector(b);

		if (direction === 'asc') {
			if (aValue < bValue) {
				return -1;
			}

			if (aValue > bValue) {
				return 1;
			}
		}

		if (direction === 'desc') {
			if (aValue > bValue) {
				return -1;
			}

			if (aValue < bValue) {
				return 1;
			}
		}

		return 0;
	});
}

export function getProperty<T>(
	row: T,
	selector: ((row: T, rowIndex?: number) => React.ReactNode) | undefined | null,
	format: Format<T> | undefined | null,
	rowIndex: number,
): React.ReactNode {
	if (!selector) {
		return null;
	}

	// format will override how the selector is displayed but the original dataset is used for sorting
	if (format && typeof format === 'function') {
		return format(row, rowIndex);
	}

	return selector(row, rowIndex);
}

export function insertItem<T>(array: T[] = [], item: T, index = 0): T[] {
	return [...array.slice(0, index), item, ...array.slice(index)];
}

export function removeItem<T>(array: T[] = [], item: T, keyField = 'id'): T[] {
	const newArray = array.slice();
	const outerField = prop(item as TableRow, keyField);

	if (outerField) {
		newArray.splice(
			newArray.findIndex((a: T) => {
				const innerField = prop(a as TableRow, keyField);

				return innerField === outerField;
			}),
			1,
		);
	} else {
		newArray.splice(
			newArray.findIndex(a => a === item),
			1,
		);
	}

	return newArray;
}

// Make sure columns have unique id's
export function decorateColumns<T>(columns: TableColumn<T>[]): TableColumn<T>[] {
	return columns.map((column, index) => {
		const decoratedColumn: TableColumn<T> = {
			...column,
			sortable: column.sortable || !!column.sortFunction || undefined,
		};

		if (!column.id) {
			decoratedColumn.id = index + 1;

			return decoratedColumn;
		}

		return decoratedColumn;
	});
}

export function getSortDirection(ascDirection: boolean | undefined = false): SortOrder {
	return ascDirection ? SortOrder.ASC : SortOrder.DESC;
}

export function handleFunctionProps(
	object: { [key: string]: unknown },
	...args: unknown[]
): { [key: string]: unknown } {
	let newObject;

	Object.keys(object)
		.map(o => object[o])
		.forEach((value, index) => {
			const oldObject = object;

			if (typeof value === 'function') {
				newObject = { ...oldObject, [Object.keys(object)[index]]: value(...args) };
				// delete oldObject[value];
			}
		});

	return newObject || object;
}

export function getNumberOfPages(rowCount: number, rowsPerPage: number): number {
	return Math.ceil(rowCount / rowsPerPage);
}

export function recalculatePage(prevPage: number, nextPage: number): number {
	return Math.min(prevPage, nextPage);
}

export const noop = (): null => null;

export function getConditionalStyle<T>(
	row: T,
	conditionalRowStyles: ConditionalStyles<T>[] = [],
	baseClassNames: string[] = [],
): { conditionalStyle: CSSObject; classNames: string } {
	let rowStyle = {};
	let classNames: string[] = [...baseClassNames];

	if (conditionalRowStyles.length) {
		conditionalRowStyles.forEach(crs => {
			if (!crs.when || typeof crs.when !== 'function') {
				throw new Error('"when" must be defined in the conditional style object and must be function');
			}

			// evaluate the field and if true return a the style to be applied
			if (crs.when(row)) {
				rowStyle = crs.style || {};

				if (crs.classNames) {
					classNames = [...classNames, ...crs.classNames];
				}

				if (typeof crs.style === 'function') {
					rowStyle = crs.style(row) || {};
				}
			}
		});
	}

	return { conditionalStyle: rowStyle, classNames: classNames.join(' ') };
}

export function isRowSelected<T>(row: T, selectedRows: T[] = [], keyField = 'id'): boolean {
	// cast row as TableRow because the property is unknown in advance therefore, typescript will throw an error
	const outerField = prop(row as TableRow, keyField);

	if (outerField) {
		return selectedRows.some(r => {
			const innerField = prop(r as TableRow, keyField);

			return innerField === outerField;
		});
	}

	return selectedRows.some(r => r === row);
}

export function isOdd(num: number): boolean {
	return num % 2 === 0;
}

export function findColumnIndexById<T>(columns: TableColumn<T>[], id: string | undefined): number {
	if (!id) {
		return -1;
	}

	return columns.findIndex(c => {
		return equalizeId(c.id, id);
	});
}

export function equalizeId(a: string | number | undefined, b: string | number | undefined): boolean {
	return a == b;
}

export type PinnedOffsets = {
	left: Record<string | number, number>;
	right: Record<string | number, number>;
};

export const EMPTY_PINNED_OFFSETS: PinnedOffsets = { left: {}, right: {} };

function resolveColumnWidth<T>(col: TableColumn<T>, columnWidths: Record<string | number, number>): number {
	if (col.id != null && columnWidths[col.id] != null) return columnWidths[col.id];
	const raw = col.width ?? col.minWidth ?? '100px';
	const n = parseFloat(raw);
	return isNaN(n) ? 100 : n;
}

export function getPinnedOffsets<T>(
	columns: TableColumn<T>[],
	columnWidths: Record<string | number, number>,
	selectableRows: boolean,
	expandableRows: boolean,
	expandableRowsHideExpander: boolean,
): PinnedOffsets {
	const visible = columns.filter(c => !c.omit);
	const hasPinned = visible.some(c => c.pinned);
	if (!hasPinned) return EMPTY_PINNED_OFFSETS;

	const SYSTEM_COL_WIDTH = 48;
	let baseLeft = 0;
	if (selectableRows) baseLeft += SYSTEM_COL_WIDTH;
	if (expandableRows && !expandableRowsHideExpander) baseLeft += SYSTEM_COL_WIDTH;

	const left: Record<string | number, number> = {};
	let leftAcc = baseLeft;
	for (const col of visible.filter(c => c.pinned === 'left')) {
		if (col.id != null) left[col.id] = leftAcc;
		leftAcc += resolveColumnWidth(col, columnWidths);
	}

	const right: Record<string | number, number> = {};
	let rightAcc = 0;
	for (const col of [...visible.filter(c => c.pinned === 'right')].reverse()) {
		if (col.id != null) right[col.id] = rightAcc;
		rightAcc += resolveColumnWidth(col, columnWidths);
	}

	return { left, right };
}

export function getPinnedTotalWidths<T>(
	columns: TableColumn<T>[],
	columnWidths: Record<string | number, number>,
	selectableRows: boolean,
	expandableRows: boolean,
	expandableRowsHideExpander: boolean,
): { left: number; right: number } {
	const visible = columns.filter(c => !c.omit);
	const hasPinned = visible.some(c => c.pinned);
	if (!hasPinned) return { left: 0, right: 0 };

	const SYSTEM_COL_WIDTH = 48;
	let left = 0;
	if (selectableRows) left += SYSTEM_COL_WIDTH;
	if (expandableRows && !expandableRowsHideExpander) left += SYSTEM_COL_WIDTH;
	for (const col of visible.filter(c => c.pinned === 'left')) {
		left += resolveColumnWidth(col, columnWidths);
	}

	let right = 0;
	for (const col of visible.filter(c => c.pinned === 'right')) {
		right += resolveColumnWidth(col, columnWidths);
	}

	return { left, right };
}

/**
 * After a column reorder, reassigns `pinned` based purely on position:
 * - The first N columns (where N = original left-pin count) become `pinned: 'left'`
 * - The last M columns (where M = original right-pin count) become `pinned: 'right'`
 * - Everything between them has `pinned` removed
 *
 * This enforces that pinned columns always form contiguous edges, and that
 * dragging a column into a pinned zone pins it while dragging one out unpins it.
 */
/**
 * Assigns pin state based on position and explicit pin zones.
 *
 * - All columns at the start with pinned: 'left' remain pinned left.
 * - All columns at the end with pinned: 'right' remain pinned right.
 * - Columns in the middle are unpinned.
 *
 * Optionally, you can pass a pinZoneMap (index -> 'left' | 'right' | undefined) to force pin state by drop.
 */
export function normalizePins<T>(
	cols: TableColumn<T>[],
	pinZoneMap?: Record<number, 'left' | 'right' | undefined>,
): TableColumn<T>[] {
	// If a pinZoneMap is provided, use it to assign pin state
	if (pinZoneMap) {
		return cols.map((col, i) => {
			const zone = pinZoneMap[i];
			if (zone) return { ...col, pinned: zone };
			const { pinned: _removed, ...rest } = col;
			return rest as TableColumn<T>;
		});
	}

	// If nothing is pinned, return the original array (preserve reference)
	const leftCount = cols.filter(c => c.pinned === 'left').length;
	const rightCount = cols.filter(c => c.pinned === 'right').length;
	if (leftCount === 0 && rightCount === 0) {
		return cols;
	}

	return cols.map((col, i) => {
		if (i < leftCount) return { ...col, pinned: 'left' };
		if (rightCount > 0 && i >= cols.length - rightCount) return { ...col, pinned: 'right' };
		const { pinned: _removed, ...rest } = col;
		return rest as TableColumn<T>;
	});
}

/**
 * Determines the pin zone for a given drop index based on boundaries.
 * leftCount: number of left-pinned columns
 * rightCount: number of right-pinned columns
 * total: total columns
 * Returns: 'left' | 'right' | undefined
 */
export function getPinZoneForIndex(
	index: number,
	leftCount: number,
	rightCount: number,
	total: number,
): 'left' | 'right' | undefined {
	if (index < leftCount) return 'left';
	if (index >= total - rightCount) return 'right';
	return undefined;
}
