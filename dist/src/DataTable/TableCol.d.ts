import * as React from 'react';
import { CellProps } from './Cell';
import { TableColumn, SortAction, SortOrder } from './types';
export interface ColumnStyleProps extends CellProps {
    isDragging?: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}
export interface ColumnSortableProps {
    disabled: boolean;
    sortActive: boolean;
}
export type TableColProps<T> = {
    column: TableColumn<T>;
    disabled: boolean;
    draggingColumnId?: string | number;
    sortIcon?: React.ReactNode;
    pagination: boolean;
    paginationServer: boolean;
    persistSelectedOnSort: boolean;
    selectedColumn: TableColumn<T>;
    sortDirection: SortOrder;
    sortServer: boolean;
    selectableRowsVisibleOnly: boolean;
    onSort: (action: SortAction<T>) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
};
declare function TableCol<T>({ column, disabled, draggingColumnId, selectedColumn, sortDirection, sortIcon, sortServer, pagination, paginationServer, persistSelectedOnSort, selectableRowsVisibleOnly, onSort, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }: TableColProps<T>): JSX.Element | null;
declare const _default: typeof TableCol;
export default _default;
