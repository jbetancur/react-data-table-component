import { SortOrder } from './types';
import { SYSTEM_COL_WIDTH } from './constants';
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

function compareBySelector<T>(a: T, b: T, selector: Selector<T>, direction: SortOrder): number {
	const flip = direction === SortOrder.ASC ? 1 : -1;
	const aValue = selector(a);
	const bValue = selector(b);

	if (aValue < bValue) {
		return -1 * flip;
	}
	if (aValue > bValue) {
		return 1 * flip;
	}
	return 0;
}

// Constant selector passed to a table-level sortFunction when no column is selected
// (the "not sorted" state), so custom sort functions can still run — e.g. to keep
// pinned rows on top — without a real field to compare by.
const noopSelector: Selector<unknown> = () => 0;

export function sort<T>(
	rows: T[],
	selector: Selector<T> | null | undefined,
	direction: SortOrder,
	sortFn?: SortFunction<T> | null,
): T[] {
	if (!selector) {
		if (sortFn && typeof sortFn === 'function') {
			return sortFn(rows.slice(0), noopSelector as Selector<T>, direction);
		}
		return rows;
	}

	if (sortFn && typeof sortFn === 'function') {
		// we must create a new rows reference
		return sortFn(rows.slice(0), selector, direction);
	}

	return rows.slice(0).sort((a, b) => compareBySelector(a, b, selector, direction));
}

/**
 * Stable multi-column sort. Compares rows by each sort column in priority order,
 * falling back to the next column when the current one ties. Honors each column's
 * `sortFunction` when provided, otherwise compares its `selector` value.
 */
export function multiSort<T>(rows: T[], sortColumns: { column: TableColumn<T>; sortDirection: SortOrder }[]): T[] {
	if (sortColumns.length === 0) {
		return rows;
	}

	return rows
		.map((row, index) => ({ row, index }))
		.sort((a, b) => {
			for (const { column, sortDirection } of sortColumns) {
				const flip = sortDirection === SortOrder.ASC ? 1 : -1;

				if (column.sortFunction && typeof column.sortFunction === 'function') {
					const result = column.sortFunction(a.row, b.row);
					if (result !== 0) {
						return result * flip;
					}
					continue;
				}

				const selector = column.selector as Selector<T> | undefined;
				if (!selector) {
					continue;
				}

				const result = compareBySelector(a.row, b.row, selector, sortDirection);
				if (result !== 0) {
					return result;
				}
			}

			// Stable tiebreaker: preserve the original order.
			return a.index - b.index;
		})
		.map(({ row }) => row);
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
	let resolved: { [key: string]: unknown } | undefined;

	for (const [key, value] of Object.entries(object)) {
		if (typeof value === 'function') {
			resolved = { ...(resolved ?? object), [key]: value(...args) };
		}
	}

	return resolved ?? object;
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

export function isEven(num: number): boolean {
	return num % 2 === 0;
}

/** Number of system cells (selection checkbox, expander) rendered before data columns. */
export function getPrefixColCount(
	selectableRows: boolean,
	expandableRows: boolean,
	expandableRowsHideExpander: boolean,
): number {
	return (selectableRows ? 1 : 0) + (expandableRows && !expandableRowsHideExpander ? 1 : 0);
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

/**
 * Resolves the system-column width (checkbox/expander cells) from the
 * `--rdt-system-col-width` CSS variable when available, falling back to the
 * default. Reading the var lets themes that customize the checkbox cell width
 * keep pinned columns aligned without code changes to this library.
 */
function resolveSystemColWidth(): number {
	if (typeof window === 'undefined' || typeof document === 'undefined') return SYSTEM_COL_WIDTH;
	const root = document.querySelector('.rdt_table') ?? document.documentElement;
	const raw = getComputedStyle(root).getPropertyValue('--rdt-system-col-width').trim();
	if (!raw) return SYSTEM_COL_WIDTH;
	const n = parseFloat(raw);
	return isNaN(n) ? SYSTEM_COL_WIDTH : n;
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

	const systemWidth = resolveSystemColWidth();
	const baseLeft = getPrefixColCount(selectableRows, expandableRows, expandableRowsHideExpander) * systemWidth;

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

	const systemWidth = resolveSystemColWidth();
	let left = getPrefixColCount(selectableRows, expandableRows, expandableRowsHideExpander) * systemWidth;
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
 * Per-cell pin metadata derived from a column and the current PinnedOffsets.
 * Centralizes the "is pinned / is edge of pin band / sticky inline style /
 * class names" calculation so TableCol and TableCell stay in sync.
 */
export type PinnedCellMeta = {
	pinnedLeft: boolean;
	pinnedRight: boolean;
	isLastLeftPin: boolean;
	isFirstRightPin: boolean;
	style: React.CSSProperties;
	className: string;
};

export function getPinnedCellMeta<T>(
	column: TableColumn<T>,
	pinnedOffsets: PinnedOffsets | undefined,
	zIndex?: number,
): PinnedCellMeta {
	const offsets = pinnedOffsets ?? EMPTY_PINNED_OFFSETS;
	const id = column.id;
	const pinnedLeft = column.pinned === 'left' && id != null && offsets.left[id] != null;
	const pinnedRight = column.pinned === 'right' && id != null && offsets.right[id] != null;

	// Largest left offset  = rightmost left-pinned column (shadow on its right edge)
	// Largest right offset = leftmost right-pinned column (shadow on its left edge)
	const leftValues = pinnedLeft ? Object.values(offsets.left) : [];
	const rightValues = pinnedRight ? Object.values(offsets.right) : [];
	const maxLeft = leftValues.length ? Math.max(...leftValues) : -1;
	const maxRight = rightValues.length ? Math.max(...rightValues) : -1;
	const isLastLeftPin = pinnedLeft && id != null && offsets.left[id] === maxLeft;
	const isFirstRightPin = pinnedRight && id != null && offsets.right[id] === maxRight;

	// Logical insets so pin bands mirror under RTL: 'left' pins stick to the
	// inline-start edge (physical right in RTL), 'right' pins to inline-end.
	const style: React.CSSProperties = pinnedLeft
		? { position: 'sticky', insetInlineStart: offsets.left[id!], ...(zIndex != null && { zIndex }) }
		: pinnedRight
			? { position: 'sticky', insetInlineEnd: offsets.right[id!], ...(zIndex != null && { zIndex }) }
			: {};

	const className = [
		pinnedLeft && 'rdt_pinLeft',
		isLastLeftPin && 'rdt_pinLeftLast',
		pinnedRight && 'rdt_pinRight',
		isFirstRightPin && 'rdt_pinRightFirst',
	]
		.filter(Boolean)
		.join(' ');

	return { pinnedLeft, pinnedRight, isLastLeftPin, isFirstRightPin, style, className };
}

/** ID of the first (leftmost) non-omitted right-pinned column — a spacer is
 * injected just before it so non-pinned cells fill the space up to the pins. */
export function getFirstRightPinnedId<T>(columns: TableColumn<T>[]): string | number | null {
	for (const col of columns) {
		if (!col.omit && col.pinned === 'right') return col.id ?? null;
	}
	return null;
}

/** Width cell props for body/footer cells: a resize override locks the cell to
 * the resized width and disables flex-grow; otherwise the column's own values apply. */
export function getCellWidthProps<T>(
	column: TableColumn<T>,
	resizedWidth: number | undefined,
): { grow: number | undefined; width: string | undefined; minWidth: string | undefined; maxWidth: string | undefined } {
	const px = resizedWidth != null ? `${resizedWidth}px` : undefined;
	return {
		grow: px != null ? 0 : column.grow,
		width: px ?? column.width,
		minWidth: px ?? column.minWidth,
		maxWidth: px ?? column.maxWidth,
	};
}

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

/**
 * Pins or unpins a column by id, moving it into the matching edge zone so pinned
 * columns stay contiguous — the same invariant drag-reorder maintains via normalizePins.
 * Pin left inserts at the end of the left zone, pin right at the start of the right
 * zone, and unpin drops the column just inside its former zone's boundary.
 * Returns the input array untouched when the id is unknown.
 */
export function setColumnPin<T>(
	columns: TableColumn<T>[],
	columnId: string | number,
	side?: 'left' | 'right',
): TableColumn<T>[] {
	const idx = findColumnIndexById(columns, String(columnId));
	if (idx === -1) return columns;

	const next = [...columns];
	const [col] = next.splice(idx, 1);
	const { pinned: _removed, ...rest } = col;
	const updated = (side ? { ...rest, pinned: side } : rest) as TableColumn<T>;

	const leftCount = next.filter(c => c.pinned === 'left').length;
	const rightCount = next.filter(c => c.pinned === 'right').length;
	let insertAt: number;
	if (side === 'left') insertAt = leftCount;
	else if (side === 'right') insertAt = next.length - rightCount;
	else insertAt = col.pinned === 'right' ? next.length - rightCount : leftCount;

	next.splice(insertAt, 0, updated);
	return next;
}
