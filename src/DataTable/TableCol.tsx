import * as React from 'react';
import styled, { css } from 'styled-components';
import { CellExtended, CellProps } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import { equalizeId } from './util';
import { TableColumn, SortAction, SortOrder, FilterAction } from './types';
import { ChangeEvent } from 'react';

interface ColumnStyleProps extends CellProps {
	$isDragging?: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ColumnStyled = styled(CellExtended) <ColumnStyleProps>`
	${({ button }) => button && 'text-align: center'};
	${({ theme, $isDragging }) => $isDragging && theme.headCells.draggingStyle};
`;

interface ColumnSortableProps {
	disabled: boolean;
	$sortActive: boolean;
}

const sortableCSS = css<ColumnSortableProps>`
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({ $sortActive }) => ($sortActive ? 'opacity: 1' : 'opacity: 0')};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({ $sortActive }) =>
		!$sortActive &&
		css`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`;

const ColumnSortable = styled.div<ColumnSortableProps>`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({ disabled }) => !disabled && sortableCSS};
`;

const ColumnText = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

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
	filterServer: boolean;
	selectableRowsVisibleOnly: boolean;
	onSort: (action: SortAction<T>) => void;
	onFilter: (action: FilterAction<T>) => void;
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
	filterServer,
	pagination,
	paginationServer,
	persistSelectedOnSort,
	selectableRowsVisibleOnly,
	onSort,
	onFilter,
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

	const [showTooltip, setShowTooltip] = React.useState(false);
	const columnRef = React.useRef<HTMLDivElement | null>(null);
	const [pristine, setPristine] = React.useState(true);

	React.useEffect(() => {
		if (columnRef.current) {
			setShowTooltip(columnRef.current.scrollWidth > columnRef.current.clientWidth);
		}
	}, [showTooltip]);

	if (column.omit) {
		return null;
	}

	React.useEffect(() => {
		if (pristine) {
			setPristine(false);
			if (column.filterable && column.selector && column.filterValue && column.filterValue !== '') {
				onFilter({
					type: 'FILTER_CHANGE',
					filterServer: filterServer,
					filterText: column.filterValue,
					selectedColumn: column,
					clearSelectedOnSort:
						(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
				});
			}
		}
	}, [pristine]);

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

	const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		if (column.filterable && column.selector) {
			column.filterValue = e.target.value;
			onFilter({
				type: 'FILTER_CHANGE',
				filterServer: filterServer,
				filterText: e.target.value,
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
	const disableSort = !column.sortable || disabled;
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	return (
		<ColumnStyled
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
			$isDragging={equalizeId(column.id, draggingColumnId)}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{column.name && (
				<div>
				<ColumnSortable
					data-column-id={column.id}
					data-sort-id={column.id}
					role="columnheader"
					tabIndex={0}
					className="rdt_TableCol_Sortable"
					onClick={!disableSort ? handleSortChange : undefined}
					onKeyPress={!disableSort ? handleKeyPress : undefined}
					$sortActive={!disableSort && sortActive}
					disabled={disableSort}
				>
					{!disableSort && customSortIconRight && renderCustomSortIcon()}
					{!disableSort && nativeSortIconRight && renderNativeSortIcon(sortActive)}

						{typeof column.name === 'string' ? (
							<ColumnText title={showTooltip ? column.name : undefined} ref={columnRef} data-column-id={column.id}>
								{column.name}
							</ColumnText>
						) : (
							column.name
						)}

						{!disableSort && customSortIconLeft && renderCustomSortIcon()}
						{!disableSort && nativeSortIconLeft && renderNativeSortIcon(sortActive)}
					</ColumnSortable>
					{column.filterable && (
						<div style={{ display: 'block' }}>
							{column.filterValues && column.filterValues.length > 0 ?
								<select name={column?.name?.toString()}
									data-filter-id={column?.name?.toString().toLowerCase()}
									onChange={handleFilterChange}>
									value={column.filterValue}
									<option value=""></option>
									{column?.filterValues?.map((filterValue, index) => (
										<option key={index} value={
											(typeof filterValue === 'object' && 'value' in filterValue ?
												filterValue.value : filterValue) as string}>
											{(typeof filterValue === 'object' && 'label' in filterValue ?
												filterValue.label : filterValue) }
										</option>
									))}
								</select>
								:
								<input
									name={column?.name?.toString()}
									value={column.filterValue}
									data-filter-id={column?.name?.toString().toLowerCase()}
									onChange={handleFilterChange}
									placeholder="filter"
								/>
							}
						</div>
					)}
					</div>
			)}
		</ColumnStyled>
	);
}

export default React.memo(TableCol) as typeof TableCol;
