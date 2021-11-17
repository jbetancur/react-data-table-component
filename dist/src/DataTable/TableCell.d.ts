import * as React from 'react';
import { TableColumn } from './types';
interface CellProps<T> {
    id: string;
    dataTag: string | null;
    column: TableColumn<T>;
    row: T;
    rowIndex: number;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}
declare function Cell<T>({ id, column, row, rowIndex, dataTag, isDragging, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }: CellProps<T>): JSX.Element;
declare const _default: typeof Cell;
export default _default;
