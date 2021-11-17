import * as React from 'react';
import { SingleRowAction, TableProps } from './types';
declare type DProps<T> = Pick<TableProps<T>, 'columns' | 'conditionalRowStyles' | 'dense' | 'expandableIcon' | 'expandableRows' | 'expandableRowsComponent' | 'expandableRowsComponentProps' | 'expandableRowsHideExpander' | 'expandOnRowClicked' | 'expandOnRowDoubleClicked' | 'highlightOnHover' | 'expandableInheritConditionalStyles' | 'keyField' | 'onRowClicked' | 'onRowDoubleClicked' | 'onRowExpandToggled' | 'pointerOnHover' | 'selectableRowDisabled' | 'selectableRows' | 'selectableRowsComponent' | 'selectableRowsComponentProps' | 'selectableRowsHighlight' | 'selectableRowsSingle' | 'striped'>;
interface TableRowProps<T> extends Required<DProps<T>> {
    draggingColumnId: number | string;
    defaultExpanded?: boolean;
    defaultExpanderDisabled: boolean;
    id: string | number;
    onSelectedRow: (action: SingleRowAction<T>) => void;
    pointerOnHover: boolean;
    row: T;
    rowCount: number;
    rowIndex: number;
    selected: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}
declare function Row<T>({ columns, conditionalRowStyles, defaultExpanded, defaultExpanderDisabled, dense, expandableIcon, expandableRows, expandableRowsComponent, expandableRowsComponentProps, expandableRowsHideExpander, expandOnRowClicked, expandOnRowDoubleClicked, highlightOnHover, id, expandableInheritConditionalStyles, keyField, onRowClicked, onRowDoubleClicked, onRowExpandToggled, onSelectedRow, pointerOnHover, row, rowCount, rowIndex, selectableRowDisabled, selectableRows, selectableRowsComponent, selectableRowsComponentProps, selectableRowsHighlight, selectableRowsSingle, selected, striped, draggingColumnId, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }: TableRowProps<T>): JSX.Element;
export default Row;
