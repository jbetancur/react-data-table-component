import * as React from 'react';
import { decorateColumns, findColumnIndexById, getSortDirection } from '../DataTable/util';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import { SortOrder, TableColumn } from '../DataTable/types';

type ColumnsHook<T> = {
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

function useColumns<T>(
	columns: TableColumn<T>[],
	onColumnOrderChange: (nextOrder: TableColumn<T>[]) => void,
	defaultSortFieldId: string | number | null | undefined,
	defaultSortAsc: boolean,
): ColumnsHook<T> {
	const [tableColumns, setTableColumns] = React.useState<TableColumn<T>[]>(() => decorateColumns(columns));
	const [draggingColumnId, setDraggingColumn] = React.useState('');
	const sourceColumnId = React.useRef('');

	useDidUpdateEffect(() => {
		setTableColumns(decorateColumns(columns));
	}, [columns]);

	const handleDragStart = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			const { attributes } = e.target as HTMLDivElement;
			const id = attributes.getNamedItem('data-column-id')?.value;

			if (id) {
				sourceColumnId.current = tableColumns[findColumnIndexById(tableColumns, id)]?.id?.toString() || '';

				setDraggingColumn(sourceColumnId.current);
			}
		},
		[tableColumns],
	);

	const handleDragEnter = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			const { attributes } = e.target as HTMLDivElement;
			const id = attributes.getNamedItem('data-column-id')?.value;

			if (id && sourceColumnId.current && id !== sourceColumnId.current) {
				const selectedColIndex = findColumnIndexById(tableColumns, sourceColumnId.current);
				const targetColIndex = findColumnIndexById(tableColumns, id);
				const reorderedCols = [...tableColumns];

				reorderedCols[selectedColIndex] = tableColumns[targetColIndex];
				reorderedCols[targetColIndex] = tableColumns[selectedColIndex];

				setTableColumns(reorderedCols);

				onColumnOrderChange(reorderedCols);
			}
		},
		[onColumnOrderChange, tableColumns],
	);

	const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleDragEnd = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		sourceColumnId.current = '';

		setDraggingColumn('');
	}, []);

	const defaultSortDirection = getSortDirection(defaultSortAsc);
	const defaultSortColumn = React.useMemo(
		() => tableColumns[findColumnIndexById(tableColumns, defaultSortFieldId?.toString())] || {},
		[defaultSortFieldId, tableColumns],
	);

	return {
		tableColumns,
		draggingColumnId,
		handleDragStart,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDragEnd,
		defaultSortDirection,
		defaultSortColumn,
	};
}

export default useColumns;
