import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { CellExtended } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import ColumnFilter from './ColumnFilter';
import { equalizeId, getPinnedCellMeta } from '../util';
import type { PinnedOffsets } from '../util';
import { SortOrder } from '../types';
import type { TableColumn, SortAction, FilterState, Localization } from '../types';

type FilterLocalization = NonNullable<Localization['filter']>;

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
	filterValue: FilterState;
	filterLocalization: FilterLocalization;
	onSort: (action: SortAction<T>) => void;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	/** Width override from column resize — takes precedence over column.width */
	resizedWidth?: number;
	onResizeStart?: (columnId: string | number, e: React.MouseEvent) => void;
	pinnedOffsets?: PinnedOffsets;
	/** CSS grid placement styles — injected by DataTableHead when rendering in grouped-header grid mode */
	gridStyle?: React.CSSProperties;
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
	filterValue,
	filterLocalization,
	onSort,
	onFilterChange,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
	resizedWidth,
	onResizeStart,
	pinnedOffsets,
	gridStyle,
}: TableColProps<T>): JSX.Element | null {
	const customStyles = useStyles();

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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
			]
				.filter(Boolean)
				.join(' ')}
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

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets);
	const pinnedStyle: React.CSSProperties = pinMeta.style.position === 'sticky' ? { ...pinMeta.style, zIndex: 2 } : {};
	const pinnedClass = pinMeta.className;

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		if (column.reorder && typeof column.name === 'string') {
			e.dataTransfer.effectAllowed = 'move';
			const el = e.currentTarget as HTMLDivElement;
			const rect = el.getBoundingClientRect();
			const ghost = document.createElement('div');
			ghost.className = 'rdt_dragGhost';
			// Grip icon + column name
			ghost.innerHTML = `<span class="rdt_dragGhostIcon" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><circle cx="5" cy="3.5" r="1.2"/><circle cx="11" cy="3.5" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/><circle cx="5" cy="12.5" r="1.2"/><circle cx="11" cy="12.5" r="1.2"/></svg></span><span class="rdt_dragGhostLabel">${column.name}</span>`;
			ghost.style.width = `${rect.width}px`;
			ghost.style.height = `${rect.height}px`;
			document.body.appendChild(ghost);
			e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, e.clientY - rect.top);
			setTimeout(() => document.body.removeChild(ghost), 0);
		}
		onDragStart(e);
	};

	// Width: resized > column.width > auto from flex
	const widthStyle =
		resizedWidth != null
			? { width: `${resizedWidth}px`, minWidth: `${resizedWidth}px`, maxWidth: `${resizedWidth}px`, flex: 'none' }
			: undefined;

	return (
		<CellExtended
			data-column-id={column.id}
			className={['rdt_TableCol', pinnedClass].filter(Boolean).join(' ')}
			$headCell
			allowOverflow={column.allowOverflow}
			button={column.button}
			compact={column.compact}
			grow={resizedWidth != null ? 0 : column.grow}
			hide={column.hide}
			maxWidth={resizedWidth != null ? undefined : column.maxWidth}
			minWidth={resizedWidth != null ? undefined : column.minWidth}
			right={column.right}
			center={column.center}
			width={resizedWidth != null ? undefined : column.width}
			draggable={column.reorder}
			headStyle={customStyles.headCells?.style as React.CSSProperties}
			style={{
				...(isDragging ? (customStyles.headCells?.draggingStyle as React.CSSProperties) : undefined),
				...widthStyle,
				...pinnedStyle,
				...(pinnedStyle.position !== 'sticky' && { position: 'relative' }),
				...gridStyle,
			}}
			onDragStart={handleDragStart}
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
					]
						.filter(Boolean)
						.join(' ')}
					onClick={!disableSort ? handleSortChange : undefined}
					onKeyDown={!disableSort ? handleKeyDown : undefined}
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
			{column.filterable && column.id != null && (
				<ColumnFilter
					columnId={column.id}
					filterValue={filterValue}
					filterType={column.filterType}
					options={filterLocalization}
					onFilterChange={onFilterChange}
				/>
			)}
			{onResizeStart && column.id != null && (
				<div className="rdt_resizeHandle" onMouseDown={e => onResizeStart(column.id!, e)} aria-hidden="true" />
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
	if (prevProps.filterValue !== nextProps.filterValue) return false;
	if (prevProps.filterLocalization !== nextProps.filterLocalization) return false;
	if (prevProps.resizedWidth !== nextProps.resizedWidth) return false;
	if (prevProps.disabled !== nextProps.disabled) return false;
	if (prevProps.sortIcon !== nextProps.sortIcon) return false;
	if (prevProps.pinnedOffsets !== nextProps.pinnedOffsets) {
		// Re-render when:
		// 1. This column's own offset changed (resize, reorder).
		// 2. The set of pinned columns changed — which can flip isLastLeftPin /
		//    isFirstRightPin for this column even when its own offset is stable
		//    (e.g. a new column was pinned past it, or the prior edge-pin was unpinned).
		const id = nextProps.column.id;
		const prevLeft = prevProps.pinnedOffsets?.left[id!];
		const nextLeft = nextProps.pinnedOffsets?.left[id!];
		const prevRight = prevProps.pinnedOffsets?.right[id!];
		const nextRight = nextProps.pinnedOffsets?.right[id!];
		if (prevLeft !== nextLeft || prevRight !== nextRight) return false;

		const prevLeftKeys = prevProps.pinnedOffsets ? Object.keys(prevProps.pinnedOffsets.left).length : 0;
		const nextLeftKeys = nextProps.pinnedOffsets ? Object.keys(nextProps.pinnedOffsets.left).length : 0;
		const prevRightKeys = prevProps.pinnedOffsets ? Object.keys(prevProps.pinnedOffsets.right).length : 0;
		const nextRightKeys = nextProps.pinnedOffsets ? Object.keys(nextProps.pinnedOffsets.right).length : 0;
		if (prevLeftKeys !== nextLeftKeys || prevRightKeys !== nextRightKeys) return false;
	}
	const pg = prevProps.gridStyle;
	const ng = nextProps.gridStyle;
	if (pg !== ng) {
		if (!pg || !ng) return false;
		if (pg.gridColumn !== ng.gridColumn || pg.gridRow !== ng.gridRow) return false;
	}
	return true;
}

export default React.memo(TableCol, areColPropsEqual) as typeof TableCol;
