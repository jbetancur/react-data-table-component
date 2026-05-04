import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';
import { CellExtended } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import { equalizeId } from './util';
import { TableColumn, SortAction, SortOrder } from './types';

type TableColProps<T> = {
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

function TableCol<T>({
	column,
	disabled,
	draggingColumnId,
	selectedColumn = {},
	sortDirection,
	sortIcon,
	sortServer,
	pagination,
	paginationServer,
	persistSelectedOnSort,
	selectableRowsVisibleOnly,
	onSort,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
}: TableColProps<T>): JSX.Element | null {
	const customStyles = useStyles();

	React.useEffect(() => {
		if (typeof column.selector === 'string') {
			console.error(
				`Warning: ${column.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [showTooltip, setShowTooltip] = React.useState(false);
	const columnRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (columnRef.current) {
			setShowTooltip(columnRef.current.scrollWidth > columnRef.current.clientWidth);
		}
	}, [showTooltip]);

	if (column.omit) {
		return null;
	}

	const handleSortChange = () => {
		if (!column.sortable && !column.selector) {
			return;
		}

		let direction = sortDirection;

		if (equalizeId(selectedColumn.id, column.id)) {
			direction = sortDirection === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
		}

		onSort({
			type: 'SORT_CHANGE',
			sortDirection: direction,
			selectedColumn: column,
			clearSelectedOnSort:
				(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
		});
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			handleSortChange();
		}
	};

	const renderNativeSortIcon = (sortActive: boolean) => (
		<NativeSortIcon sortActive={sortActive} sortDirection={sortDirection} />
	);

	const renderCustomSortIcon = () => (
		<span
			className={[
				'rdt_sortIcon',
				sortActive ? 'rdt_sortIconActive' : 'rdt_sortIconInactive',
				sortDirection === SortOrder.ASC && 'rdt_sortIconAsc',
				'__rdt_custom_sort_icon__',
			].filter(Boolean).join(' ')}
		>
			{sortIcon}
		</span>
	);

	const sortActive = !!(column.sortable && equalizeId(selectedColumn.id, column.id));
	const disableSort = !column.sortable || disabled;
	const tabIndex = disableSort ? -1 : 0;
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	const isDragging = equalizeId(column.id, draggingColumnId);

	return (
		<CellExtended
			data-column-id={column.id}
			className="rdt_TableCol"
			$headCell
			allowOverflow={column.allowOverflow}
			button={column.button}
			compact={column.compact}
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			center={column.center}
			width={column.width}
			draggable={column.reorder}
			headStyle={customStyles.headCells?.style as React.CSSProperties}
			style={isDragging ? (customStyles.headCells?.draggingStyle as React.CSSProperties) : undefined}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{column.name && (
				<div
					data-column-id={column.id}
					data-sort-id={column.id}
					role="columnheader"
					tabIndex={tabIndex}
					className={[
						'rdt_TableCol_Sortable',
						'rdt_columnSortable',
						!disableSort && 'rdt_columnSortableEnabled',
						!disableSort && sortActive && 'rdt_columnSortableActive',
					].filter(Boolean).join(' ')}
					onClick={!disableSort ? handleSortChange : undefined}
					onKeyPress={!disableSort ? handleKeyPress : undefined}
					aria-sort={
						!disableSort
							? sortActive
								? sortDirection === SortOrder.ASC
									? 'ascending'
									: 'descending'
								: 'none'
							: undefined
					}
				>
					{!disableSort && customSortIconRight && renderCustomSortIcon()}
					{!disableSort && nativeSortIconRight && renderNativeSortIcon(sortActive)}

					{typeof column.name === 'string' ? (
						<div
							title={showTooltip ? column.name : undefined}
							ref={columnRef}
							data-column-id={column.id}
							className="rdt_columnText"
						>
							{column.name}
						</div>
					) : (
						column.name
					)}

					{!disableSort && customSortIconLeft && renderCustomSortIcon()}
					{!disableSort && nativeSortIconLeft && renderNativeSortIcon(sortActive)}
				</div>
			)}
		</CellExtended>
	);
}

function areColPropsEqual<T>(prevProps: TableColProps<T>, nextProps: TableColProps<T>): boolean {
	if (prevProps.column !== nextProps.column) return false;
	const prevIsSelected = equalizeId(prevProps.selectedColumn.id, prevProps.column.id);
	const nextIsSelected = equalizeId(nextProps.selectedColumn.id, nextProps.column.id);
	if (prevIsSelected !== nextIsSelected) return false;
	if (prevIsSelected && nextIsSelected && prevProps.sortDirection !== nextProps.sortDirection) return false;
	if (prevProps.draggingColumnId !== nextProps.draggingColumnId) {
		const prevIsDragging = equalizeId(prevProps.column.id, prevProps.draggingColumnId);
		const nextIsDragging = equalizeId(nextProps.column.id, nextProps.draggingColumnId);
		if (prevIsDragging !== nextIsDragging) return false;
	}
	if (prevProps.disabled !== nextProps.disabled) return false;
	if (prevProps.sortIcon !== nextProps.sortIcon) return false;
	return true;
}

export default React.memo(TableCol, areColPropsEqual) as typeof TableCol;
