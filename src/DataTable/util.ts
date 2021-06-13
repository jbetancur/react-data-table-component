import orderBy from 'lodash.orderby';
import { CSSObject } from 'styled-components';
import { Direction } from './constants';
import {
	ConditionalStyles,
	TableColumn,
	DefaultSortField,
	Format,
	RowRecord,
	Selector,
	SortDirection,
	SortFunction,
} from './types';

export function isEmpty(field: string | number | undefined = ''): boolean {
	if (typeof field === 'number') {
		return false;
	}

	return !field || field.length === 0;
}

export function setRowData<T>(
	rows: Array<T>,
	selector: Selector<T> | null | undefined,
	direction: SortDirection,
	sortServer: boolean,
	sortFn?: SortFunction<T> | null,
): Array<T> {
	if (sortServer || !selector) {
		return rows;
	}

	return sort(rows, selector, direction, sortFn);
}

export function sort<T = RowRecord>(
	rows: Array<T>,
	selector: Selector<T> | null | undefined,
	direction: SortDirection,
	sortFn?: SortFunction<T> | null,
): T[] {
	if (!selector) {
		return rows;
	}

	if (sortFn && typeof sortFn === 'function') {
		return sortFn(rows, selector, direction);
	}

	return orderBy(rows, selector, direction);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProperty<T extends Record<string, any>>(
	row: T,
	selector: Selector<T> | undefined | null | unknown,
	format: Format<T> | undefined | null,
	rowIndex: number,
): React.ReactNode {
	if (!selector) {
		return null;
	}

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

	// string based selectors will be removed in v8
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

export function insertItem<T>(array: Array<T> = [], item: T, index = 0): Array<T> {
	return [...array.slice(0, index), item, ...array.slice(index)];
}

export function removeItem<T extends RowRecord>(array: Array<T> = [], item: T, keyField = 'id'): Array<T> {
	const newArray = array.slice();

	if (item[keyField]) {
		newArray.splice(
			newArray.findIndex((a: T) => a[keyField] === item[keyField]),
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

export function getColumnById<T>(id: DefaultSortField, columns: TableColumn<T>[]): TableColumn<T> | undefined {
	if (typeof id === undefined) {
		return undefined;
	}

	return columns.find(col => col.id === id);
}

export function getSortDirection(ascDirection: boolean | undefined = false): SortDirection {
	return ascDirection ? 'asc' : 'desc';
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

export function getConditionalStyle<T>(row: T, conditionalRowStyles: ConditionalStyles<T>[] = []): CSSObject {
	let rowStyle = {};

	if (conditionalRowStyles.length) {
		conditionalRowStyles.forEach(crs => {
			if (!crs.when || typeof crs.when !== 'function') {
				throw new Error('"when" must be defined in the conditional style object and must be function');
			}

			// evaluate the field and if true return a the style to be applied
			if (crs.when(row)) {
				rowStyle = crs.style || {};

				if (typeof crs.style === 'function') {
					rowStyle = crs.style(row) || {};
				}
			}
		});
	}

	return rowStyle;
}

export function isRowSelected<T extends RowRecord>(row: T, selectedRows: Array<T> = [], keyField = 'id'): boolean {
	if (row[keyField]) {
		return selectedRows.some(r => r[keyField] === row[keyField]);
	}

	return selectedRows.some(r => r === row);
}

export function detectRTL(direction: Direction = Direction.AUTO): boolean {
	if (direction === 'auto') {
		const canUse = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
		const bodyRTL = <HTMLScriptElement>document.getElementsByTagName('BODY')[0];
		const htmlTRL = <HTMLScriptElement>document.getElementsByTagName('HTML')[0];
		const hasRTL = bodyRTL.dir === 'rtl' || htmlTRL.dir === 'rtl';

		return canUse && hasRTL;
	}

	return direction === 'rtl';
}

export function isOdd(num: number): boolean {
	return num % 2 === 0;
}
