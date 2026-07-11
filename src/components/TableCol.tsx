import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { CellExtended } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import ColumnFilter from './ColumnFilter';
import { equalizeId, getPinnedCellMeta } from '../util';
import type { PinnedOffsets } from '../util';
import { setDragGhost } from '../dom';
import { SortOrder } from '../types';
import type { TableColumn, SortAction, SortColumn, FilterState, Localization } from '../types';
import type { ActiveCell } from '../context/RowContext';
import type { HeaderMenuSlice } from '../hooks/useContextMenu';

type FilterLocalization = NonNullable<Localization['filter']>;

type TableColProps<T> = {
	column: TableColumn<T>;
	disabled: boolean;
	draggingColumnId?: string | number;
	sortIcon?: React.ReactNode;
	pagination: boolean;
	paginationServer: boolean;
	persistSelectedOnSort: boolean;
	sortDirection: SortOrder;
	sortColumns: SortColumn<T>[];
	sortMulti: boolean;
	defaultSortDirection: SortOrder;
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
	onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
	/** Width override from column resize — takes precedence over column.width */
	resizedWidth?: number;
	onResizeStart?: (columnId: string | number, e: React.PointerEvent) => void;
	pinnedOffsets?: PinnedOffsets;
	/** CSS grid placement styles — injected by DataTableHead when rendering in grouped-header grid mode */
	gridStyle?: React.CSSProperties;
	// Cell navigation: this header cell's column in the nav grid (header row is -1)
	cellNavigation?: boolean;
	activeCell?: ActiveCell | null;
	navCol?: number;
	/** Header context-menu feature slice — `null` when the feature is off.
	 *  Compared by reference in areColPropsEqual. */
	headerMenu?: HeaderMenuSlice<T>;
};

function TableCol<T>({
	column,
	disabled,
	draggingColumnId,
	sortDirection,
	sortColumns,
	sortMulti,
	defaultSortDirection,
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
	onPointerDown,
	resizedWidth,
	onResizeStart,
	pinnedOffsets,
	gridStyle,
	cellNavigation,
	activeCell,
	navCol,
	headerMenu,
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

	const handleSortChange = (additive: boolean) => {
		if (!column.sortable && !column.selector) {
			return;
		}

		onSort({
			type: 'SORT_CHANGE',
			selectedColumn: column,
			additive: sortMulti && additive,
			defaultSortDirection,
			clearSelectedOnSort:
				(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
		});
	};

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		handleSortChange(event.ctrlKey || event.metaKey);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSortChange(event.ctrlKey || event.metaKey);
		}
	};

	const sortIndex = sortColumns.findIndex(s => equalizeId(s.column.id, column.id));
	const sortEntry = sortIndex === -1 ? undefined : sortColumns[sortIndex];
	const columnSortDirection = sortEntry ? sortEntry.sortDirection : sortDirection;

	const renderNativeSortIcon = (sortActive: boolean) => (
		<NativeSortIcon sortActive={sortActive} sortDirection={columnSortDirection} />
	);

	const renderCustomSortIcon = () => (
		<span
			className={[
				'rdt_sortIcon',
				sortActive ? 'rdt_sortIconActive' : 'rdt_sortIconInactive',
				columnSortDirection === SortOrder.ASC && 'rdt_sortIconAsc',
				'__rdt_custom_sort_icon__',
			]
				.filter(Boolean)
				.join(' ')}
		>
			{sortIcon}
		</span>
	);

	const renderSortPriority = () =>
		sortMulti && sortColumns.length > 1 && sortIndex !== -1 ? (
			<span className="rdt_sortPriority" aria-hidden="true">
				{sortIndex + 1}
			</span>
		) : null;

	const sortActive = !!(column.sortable && sortIndex !== -1);
	const disableSort = !column.sortable || disabled;
	const isNavActive = !!cellNavigation && activeCell?.row === -1 && activeCell?.col === navCol;
	// With cellNavigation the whole grid is one Tab stop (roving tabindex); otherwise
	// only sortable headers are tabbable.
	const tabIndex = cellNavigation ? (isNavActive ? 0 : -1) : disableSort ? -1 : 0;
	// data-nav-row/col live on the outer cell (full column width) so the :focus-within
	// ring spans the whole header, matching body gridcells — not just the inner sortable
	// div, which is inset by header padding and would otherwise draw a narrower ring.
	const outerNavAttributes = cellNavigation ? { 'data-nav-row': -1, 'data-nav-col': navCol } : undefined;
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	const isDragging = equalizeId(column.id, draggingColumnId);

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets, 2);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		if (column.reorder && typeof column.name === 'string') {
			setDragGhost(e, column.name);
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
			className={['rdt_TableCol', pinMeta.className].filter(Boolean).join(' ')}
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
				...pinMeta.style,
				...(pinMeta.style.position !== 'sticky' && { position: 'relative' }),
				...gridStyle,
			}}
			onDragStart={handleDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onPointerDown={column.reorder ? onPointerDown : undefined}
			onContextMenu={headerMenu?.rightClick ? (e: React.MouseEvent) => headerMenu.onContextMenu(column, e) : undefined}
			{...outerNavAttributes}
			data-nav-widget={cellNavigation && column.name ? 'true' : undefined}
			{...(cellNavigation && !column.name ? { role: 'columnheader', tabIndex } : undefined)}
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
					onClick={!disableSort ? handleClick : undefined}
					onKeyDown={!disableSort ? handleKeyDown : undefined}
					aria-sort={
						!disableSort
							? sortActive
								? columnSortDirection === SortOrder.ASC
									? 'ascending'
									: 'descending'
								: 'none'
							: undefined
					}
				>
					{!disableSort && customSortIconRight && renderCustomSortIcon()}
					{!disableSort && nativeSortIconRight && renderNativeSortIcon(sortActive)}
					{!disableSort && column.right && renderSortPriority()}

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

					{!disableSort && !column.right && renderSortPriority()}
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
			{/* The menu button renders after the filter so it is always the outermost
			    header control (flex order mirrors it automatically in RTL). */}
			{headerMenu?.menuButton && (
				<button
					type="button"
					className="rdt_kebabIcon"
					aria-label={headerMenu.ariaLabel}
					aria-haspopup="menu"
					onClick={e => {
						e.stopPropagation();
						headerMenu.onMenuButtonClick(column, e);
					}}
					onPointerDown={e => e.stopPropagation()}
				>
					<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
						<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
					</svg>
				</button>
			)}
			{onResizeStart && column.id != null && (
				<div
					className="rdt_resizeHandle"
					onPointerDown={e => {
						// Keep a resize gesture from also starting a column reorder on the cell.
						e.stopPropagation();
						onResizeStart(column.id!, e);
					}}
					aria-hidden="true"
				/>
			)}
		</CellExtended>
	);
}

function areColPropsEqual<T>(prevProps: TableColProps<T>, nextProps: TableColProps<T>): boolean {
	if (prevProps.column !== nextProps.column) return false;
	if (prevProps.headerMenu !== nextProps.headerMenu) return false;
	if (prevProps.sortMulti !== nextProps.sortMulti) return false;
	// Compare this column's slice of the sort config (position + direction). A change to
	// either flips its active state, arrow direction, or multi-sort priority badge.
	const prevIdx = prevProps.sortColumns.findIndex(s => equalizeId(s.column.id, prevProps.column.id));
	const nextIdx = nextProps.sortColumns.findIndex(s => equalizeId(s.column.id, nextProps.column.id));
	if (prevIdx !== nextIdx) return false;
	if (prevIdx !== -1 && prevProps.sortColumns[prevIdx].sortDirection !== nextProps.sortColumns[nextIdx].sortDirection)
		return false;
	// The priority badge shows only when more than one column is sorted; a flip across that
	// threshold changes whether the badge renders even when this column's index is unchanged.
	if (prevProps.sortMulti && prevProps.sortColumns.length !== nextProps.sortColumns.length) {
		const prevMulti = prevProps.sortColumns.length > 1;
		const nextMulti = nextProps.sortColumns.length > 1;
		if (prevMulti !== nextMulti) return false;
	}
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
	if (prevProps.cellNavigation !== nextProps.cellNavigation) return false;
	if (prevProps.navCol !== nextProps.navCol) return false;
	// Only re-render for active-cell changes that flip this header's Tab-stop state.
	const prevNavActive =
		!!prevProps.cellNavigation && prevProps.activeCell?.row === -1 && prevProps.activeCell?.col === prevProps.navCol;
	const nextNavActive =
		!!nextProps.cellNavigation && nextProps.activeCell?.row === -1 && nextProps.activeCell?.col === nextProps.navCol;
	if (prevNavActive !== nextNavActive) return false;
	return true;
}

export default React.memo(TableCol, areColPropsEqual) as typeof TableCol;
