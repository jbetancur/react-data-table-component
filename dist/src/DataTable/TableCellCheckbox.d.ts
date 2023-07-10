import * as React from 'react';
import { RowState, SingleRowAction, ComponentProps } from './types';
type TableCellCheckboxProps<T> = {
    name: string;
    keyField: string;
    row: T;
    rowCount: number;
    selected: boolean;
    selectableRowsComponent: 'input' | React.ReactNode;
    selectableRowsComponentProps: ComponentProps;
    selectableRowsSingle: boolean;
    selectableRowDisabled: RowState<T>;
    onSelectedRow: (action: SingleRowAction<T>) => void;
};
declare function TableCellCheckbox<T>({ name, keyField, row, rowCount, selected, selectableRowsComponent, selectableRowsComponentProps, selectableRowsSingle, selectableRowDisabled, onSelectedRow, }: TableCellCheckboxProps<T>): JSX.Element;
export default TableCellCheckbox;
