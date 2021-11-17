/// <reference types="react" />
import { CSSObject } from 'styled-components';
import { ConditionalStyles, TableColumn, Format, Selector, SortOrder, SortFunction } from './types';
export declare function prop<T, K extends keyof T>(obj: T, key: K): T[K];
export declare function isEmpty(field?: string | number | undefined): boolean;
export declare function sort<T>(rows: T[], selector: Selector<T> | string | null | undefined, direction: SortOrder, sortFn?: SortFunction<T> | null): T[];
export declare function parseSelector<T extends Record<string, any>>(row: T, selector: string): T;
export declare function getProperty<T>(row: T, selector: Selector<T> | string | undefined | null | unknown, format: Format<T> | undefined | null, rowIndex: number): React.ReactNode;
export declare function insertItem<T>(array: T[] | undefined, item: T, index?: number): T[];
export declare function removeItem<T>(array: T[] | undefined, item: T, keyField?: string): T[];
export declare function decorateColumns<T>(columns: TableColumn<T>[]): TableColumn<T>[];
export declare function getSortDirection(ascDirection?: boolean | undefined): SortOrder;
export declare function handleFunctionProps(object: {
    [key: string]: unknown;
}, ...args: unknown[]): {
    [key: string]: unknown;
};
export declare function getNumberOfPages(rowCount: number, rowsPerPage: number): number;
export declare function recalculatePage(prevPage: number, nextPage: number): number;
export declare const noop: () => null;
export declare function getConditionalStyle<T>(row: T, conditionalRowStyles?: ConditionalStyles<T>[], baseClassNames?: string[]): {
    style: CSSObject;
    classNames: string;
};
export declare function isRowSelected<T>(row: T, selectedRows?: T[], keyField?: string): boolean;
export declare function isOdd(num: number): boolean;
export declare function findColumnIndexById<T>(columns: TableColumn<T>[], id: string | undefined): number;
export declare function equalizeId(a: string | number | undefined, b: string | number | undefined): boolean;
