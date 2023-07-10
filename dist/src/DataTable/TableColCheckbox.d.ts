import * as React from 'react';
import { AllRowsAction, RowState } from './types';
interface ColumnCheckboxProps<T> {
    headCell?: boolean;
    selectableRowsComponent: 'input' | React.ReactNode;
    selectableRowsComponentProps: Record<string, unknown>;
    selectableRowDisabled: RowState<T>;
    keyField: string;
    mergeSelections: boolean;
    rowData: T[];
    selectedRows: T[];
    allSelected: boolean;
    onSelectAllRows: (action: AllRowsAction<T>) => void;
}
declare function ColumnCheckbox<T>({ headCell, rowData, keyField, allSelected, mergeSelections, selectedRows, selectableRowsComponent, selectableRowsComponentProps, selectableRowDisabled, onSelectAllRows, }: ColumnCheckboxProps<T>): JSX.Element;
export default ColumnCheckbox;
