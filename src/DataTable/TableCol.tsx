import * as React from 'react';
import styled, { css } from 'styled-components';
import { CellExtended, CellProps } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import { equalizeId, sort } from './util';
import { TableColumn, SortAction, SortDirection, SortFunction } from './types';

interface ColumnStyleProps extends CellProps {
	isDragging?: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ColumnStyled = styled(CellExtended)<ColumnStyleProps>`
	${({ button }) => button && 'text-align: center'};
	${({ theme, isDragging }) => isDragging && theme.headCells.draggingStyle};
`;

interface ColumnSortableProps {
	disabled: boolean;
	sortActive: boolean;
	sortable: boolean | undefined;
}

const sortableCSS = css<ColumnSortableProps>`
	${({ theme }) => theme.headCells.sortStyle};
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({ sortActive }) => (sortActive ? 'opacity: 1' : 'opacity: 0')};
			color: inherit;
			font-size: 18px !important;
			height: 18px !important;
			width: 18px !important;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 125ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	&:hover {
		span,
		span.__rdt_custom_sort_icon__ * {
			${({ sortActive }) => !sortActive && 'opacity: 0.8'};
		}
	}
`;

const ColumnSortable = styled.div<ColumnSortableProps>`
	align-items: center;
	height: 100%;
	line-height: 1.5;
	outline: none;
	user-select: none;
	display: inline-flex;
	overflow: hidden;
	${({ disabled, sortable }) => sortable && !disabled && sortableCSS};
`;

const ColumnText = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

type TableColProps<T> = {
	rows: T[];
	column: TableColumn<T>;
	disabled: boolean;
	draggingColumnId?: string | number;
	sortIcon?: React.ReactNode;
	pagination: boolean;
	paginationServer: boolean;
	persistSelectedOnSort: boolean;
	selectedColumn: TableColumn<T>;
	sortDirection: SortDirection;
	sortFunction: SortFunction<T> | null;
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
	rows,
	column,
	disabled,
	draggingColumnId,
	selectedColumn = {},
	sortDirection,
	sortFunction,
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
	React.useEffect(() => {
		if (typeof column.selector === 'string') {
			console.error(
				`Warning: ${column.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (column.omit) {
		return null;
	}

	const handleSortChange = () => {
		if (column.sortable && column.selector) {
			let direction = sortDirection;

			if (equalizeId(selectedColumn.id, column.id)) {
				direction = sortDirection === 'asc' ? 'desc' : 'asc';
			}

			let sortedRows = rows;

			if (!sortServer) {
				sortedRows = sort(rows, column.selector, direction, sortFunction);

				// colCustomSortFn is still checked for undefined or null
				const colCustomSortFn = column.sortFunction;

				if (colCustomSortFn) {
					const customSortFunction = direction === 'asc' ? colCustomSortFn : (a: T, b: T) => colCustomSortFn(a, b) * -1;

					sortedRows = [...rows].sort(customSortFunction);
				}
			}

			onSort({
				type: 'SORT_CHANGE',
				rows: sortedRows,
				sortDirection: direction,
				selectedColumn: column,
				clearSelectedOnSort:
					(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
			});
		}
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
		<span className={[sortDirection, '__rdt_custom_sort_icon__'].join(' ')}>{sortIcon}</span>
	);

	const sortActive = !!(column.sortable && equalizeId(selectedColumn.id, column.id));
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	return (
		<ColumnStyled
			data-column-id={column.id}
			className="rdt_TableCol"
			headCell
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
			isDragging={equalizeId(column.id, draggingColumnId)}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{column.name && (
				<ColumnSortable
					data-column-id={column.id}
					data-sort-id={column.id}
					role="columnheader"
					tabIndex={0}
					className="rdt_TableCol_Sortable"
					onClick={!disabled ? handleSortChange : undefined}
					onKeyPress={!disabled ? handleKeyPress : undefined}
					sortActive={!disabled && sortActive}
					sortable={column.sortable}
					disabled={disabled}
				>
					{!disabled && customSortIconRight && renderCustomSortIcon()}
					{!disabled && nativeSortIconRight && renderNativeSortIcon(sortActive)}

					<ColumnText data-column-id={column.id}>{column.name}</ColumnText>

					{!disabled && customSortIconLeft && renderCustomSortIcon()}
					{!disabled && nativeSortIconLeft && renderNativeSortIcon(sortActive)}
				</ColumnSortable>
			)}
		</ColumnStyled>
	);
}

export default React.memo(TableCol) as typeof TableCol;
