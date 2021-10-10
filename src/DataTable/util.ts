import { CSSObject } from 'styled-components';
import { ConditionalStyles, TableColumn, Format, TableRow, Selector, SortOrder, SortFunction } from './types';

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
	// TODO: remove string in V8
	selector: Selector<T> | string | null | undefined,
	direction: SortOrder,
	sortFn?: SortFunction<T> | null,
): T[] {
	if (!selector) {
		return rows;
	}

	if (sortFn && typeof sortFn === 'function') {
		// we must create a new rows reference
		return sortFn(rows.slice(0), selector as Selector<T>, direction);
	}

	return rows.slice(0).sort((a: T, b: T) => {
		let aValue;
		let bValue;

		if (typeof selector === 'string') {
			aValue = parseSelector(a, selector);
			bValue = parseSelector(b, selector);
		} else {
			aValue = selector(a);
			bValue = selector(b);
		}

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

// TODO: string based selectors will be removed in v8
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseSelector<T extends Record<string, any>>(row: T, selector: string): T {
	return selector.split('.').reduce((acc, part) => {
		// O(n2) when querying for an array (e.g. items[0].name)
		// Likely, the object depth will be reasonable enough that performance is not a concern
		const arr = part.match(/[^\]\\[.]+/g);
		if (arr && arr.length > 1) {
			for (let i = 0; i < arr.length; i++) {
				return acc[arr[i]][arr[i + 1]];
			}
		}

		return acc[part];
	}, row);
}

export function getProperty<T>(
	row: T,
	// TODO: remove string type in V8
	selector: Selector<T> | string | undefined | null | unknown, // unknown allows us to throw an error for JS code
	format: Format<T> | undefined | null,
	rowIndex: number,
): React.ReactNode {
	if (!selector) {
		return null;
	}

	// TODO: remove  string check in V8
	if (typeof selector !== 'string' && typeof selector !== 'function') {
		throw new Error('selector must be a . delimited string eg (my.property) or function (e.g. row => row.field');
	}

	// format will override how the selector is displayed but the original dataset is used for sorting
	if (format && typeof format === 'function') {
		return format(row, rowIndex);
	}

	if (selector && typeof selector === 'function') {
		return selector(row, rowIndex);
	}

	// TODO: Remove in V8
	return parseSelector(row, selector);
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
): { style: CSSObject; classNames: string } {
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

	return { style: rowStyle, classNames: classNames.join(' ') };
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
