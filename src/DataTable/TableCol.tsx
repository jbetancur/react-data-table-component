import * as React from 'react';
import styled from 'styled-components';
import { Cell, CellProps } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import { sort } from './util';
import { TableColumn, SortAction, SortDirection, SortFunction } from './types';

const TableColStyle = styled(Cell)<CellProps>`
	${({ button }) => button && 'text-align: center'};
`;

interface ColumnSortableProps {
	sortable: boolean | undefined;
	sortActive: boolean;
}

const ColumnSortable = styled.div<ColumnSortableProps>`
	display: inline-flex;
	align-items: center;
	height: 100%;
	line-height: 1;
	user-select: none;
	${({ theme, sortActive }) => (sortActive ? theme.headCells.activeSortStyle : theme.headCells.inactiveSortStyle)};

	span.__rdt_custom_sort_icon__ {
		i,
		svg {
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
		${({ sortable }) => sortable && 'cursor: pointer'};
		${({ sortable, theme }) => sortable && theme.headCells.activeStyle};

		span,
		span.__rdt_custom_sort_icon__ * {
			${({ sortActive, sortable }) => !sortActive && sortable && 'opacity: 1'};
		}
	}
`;

type TableColProps<T> = {
	rows: T[];
	column: TableColumn<T>;
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
};

function TableCol<T>({
	rows,
	column,
	selectedColumn,
	sortDirection,
	sortFunction,
	sortIcon,
	sortServer,
	pagination,
	paginationServer,
	persistSelectedOnSort,
	selectableRowsVisibleOnly,
	onSort,
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

			if (selectedColumn.id === column.id) {
				direction = sortDirection === 'asc' ? 'desc' : 'asc';
			}

			let sortedRows = sort<T>(rows, column.selector, direction, sortFunction);

			// declare this as a const since ts throws strict null check on a ternary line 108
			// sortFn is still checked for undefined or null
			const sortFn = column.sortFunction;

			if (sortFn) {
				const customSortFunction = direction === 'asc' ? sortFn : (a: T, b: T) => sortFn(a, b) * -1;

				sortedRows = [...rows].sort(customSortFunction);
			}

			onSort({
				type: 'SORT_CHANGE',
				rows: sortedRows,
				sortDirection: direction,
				sortServer,
				selectedColumn: column,
				pagination,
				paginationServer,
				visibleOnly: selectableRowsVisibleOnly,
				persistSelectedOnSort,
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

	const sortActive = !!(column.sortable && selectedColumn.id === column.id);
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	return (
		<TableColStyle
			className="rdt_TableCol"
			head
			allowOverflow={column.allowOverflow}
			button={column.button}
			compact={column.compact}
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			width={column.width}
		>
			{column.name && (
				<ColumnSortable
					id={`column-${column.id}`}
					role="columnheader"
					tabIndex={0}
					className="rdt_TableCol_Sortable"
					onClick={handleSortChange}
					onKeyPress={handleKeyPress}
					sortable={column.sortable}
					sortActive={sortActive}
				>
					{customSortIconRight && renderCustomSortIcon()}
					{nativeSortIconRight && renderNativeSortIcon(sortActive)}
					<div>{column.name}</div>
					{customSortIconLeft && renderCustomSortIcon()}
					{nativeSortIconLeft && renderNativeSortIcon(sortActive)}
				</ColumnSortable>
			)}
		</TableColStyle>
	);
}

export default React.memo(TableCol) as typeof TableCol;
