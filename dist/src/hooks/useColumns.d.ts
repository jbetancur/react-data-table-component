import * as React from 'react';
import { SortOrder, TableColumn } from '../DataTable/types';
declare type ColumnsHook<T> = {
    tableColumns: TableColumn<T>[];
    draggingColumnId: string;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    defaultSortDirection: SortOrder;
    defaultSortColumn: TableColumn<T>;
};
declare function useColumns<T>(columns: TableColumn<T>[], onColumnOrderChange: (nextOrder: TableColumn<T>[]) => void, defaultSortFieldId: string | number | null | undefined, defaultSortAsc: boolean): ColumnsHook<T>;
export default useColumns;
