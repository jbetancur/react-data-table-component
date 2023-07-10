import * as React from 'react';
import { Direction } from './constants';
import { PaginationOptions } from './types';
interface PaginationProps {
    rowsPerPage: number;
    rowCount: number;
    currentPage: number;
    direction?: Direction;
    paginationRowsPerPageOptions?: number[];
    paginationIconLastPage?: React.ReactNode;
    paginationIconFirstPage?: React.ReactNode;
    paginationIconNext?: React.ReactNode;
    paginationIconPrevious?: React.ReactNode;
    paginationComponentOptions?: PaginationOptions;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (numRows: number, currentPage: number) => void;
}
declare function Pagination({ rowsPerPage, rowCount, currentPage, direction, paginationRowsPerPageOptions, paginationIconLastPage, paginationIconFirstPage, paginationIconNext, paginationIconPrevious, paginationComponentOptions, onChangeRowsPerPage, onChangePage, }: PaginationProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Pagination>;
export default _default;
