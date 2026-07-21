import * as React from 'react';
import { equalizeId } from '../util';
import { emptyFilterState } from './useColumnFilter';
import { SortOrder } from '../types';
import type {
	ColumnGroup,
	ContextMenuAction,
	ContextMenuActionContext,
	ContextMenuActions,
	ContextMenuConfig,
	FilterState,
	Localization,
	SortAction,
	SortColumn,
	TableColumn,
} from '../types';

type ContextMenuLocalization = NonNullable<Localization['contextMenu']>;

type MenuState<T> = {
	ctx: ContextMenuActionContext<T>;
	position: { x: number; y: number };
	anchorRect: DOMRect | null;
};

type UseContextMenuOptions<T> = {
	contextMenu: boolean | ContextMenuConfig | undefined;
	contextMenuActions: ContextMenuActions<T> | undefined;
	onContextMenuAction: ((action: ContextMenuAction, ctx: ContextMenuActionContext<T>) => void) | undefined;
	localization: ContextMenuLocalization;
	tableColumns: TableColumn<T>[];
	columnGroups: ColumnGroup[] | undefined;
	sortColumns: SortColumn<T>[];
	defaultSortDirection: SortOrder;
	clearSelectedOnSort: boolean;
	filterValues: Record<string | number, FilterState>;
	onSort: (action: SortAction<T>) => void;
	onClearSort: () => void;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
	onPinColumn: (columnId: string | number, side?: 'left' | 'right') => void;
	onHideColumn: (columnId: string | number) => void;
	onResetColumns: () => void;
};

export type OpenContextMenu = {
	groups: ContextMenuAction[][];
	position: { x: number; y: number };
	anchorRect: DOMRect | null;
	ariaLabel: string;
};

/**
 * Feature slices — each consumer surface gets one memoized object, `null` when the
 * feature is off for that surface. Slice identity is the memoization contract:
 * TableCol's memo and the context dep lists compare these by reference, so fields
 * must be scalars or ref-stable callbacks. Add fields here, not to the contexts.
 */
export type HeaderMenuSlice<T> = {
	rightClick: boolean;
	menuButton: boolean;
	ariaLabel: string;
	onContextMenu: (column: TableColumn<T>, e: React.MouseEvent) => void;
	onMenuButtonClick: (column: TableColumn<T>, e: React.MouseEvent<HTMLButtonElement>) => void;
} | null;

export type RowMenuSlice<T> = {
	rightClick: boolean;
	menuButton: boolean;
	menuButtonPosition: 'start' | 'end';
	ariaLabel: string;
	onContextMenu: (row: T, rowIndex: number, e: React.MouseEvent) => void;
	onMenuButtonClick: (row: T, rowIndex: number, e: React.MouseEvent<HTMLButtonElement>) => void;
} | null;

type UseContextMenuResult<T> = {
	header: HeaderMenuSlice<T>;
	row: RowMenuSlice<T>;
	open: OpenContextMenu | null;
	onSelect: (action: ContextMenuAction) => void;
	onClose: (returnFocus: boolean) => void;
};

/**
 * Owns the context-menu feature: trigger handlers (right-click and menu button), the
 * open-menu state, built-in header actions (sort / pin / hide / reset), and merging
 * of consumer-supplied actions. DataTable renders <ContextMenu /> from `open` and
 * passes the `header` / `row` slices through the contexts untouched.
 */
export default function useContextMenu<T>({
	contextMenu,
	contextMenuActions,
	onContextMenuAction,
	localization,
	tableColumns,
	columnGroups,
	sortColumns,
	defaultSortDirection,
	clearSelectedOnSort,
	filterValues,
	onSort,
	onClearSort,
	onFilterChange,
	onPinColumn,
	onHideColumn,
	onResetColumns,
}: UseContextMenuOptions<T>): UseContextMenuResult<T> {
	const [menuState, setMenuState] = React.useState<MenuState<T> | null>(null);
	const triggerRef = React.useRef<HTMLElement | null>(null);

	const config = contextMenu
		? {
				header: typeof contextMenu === 'object' ? contextMenu.header !== false : true,
				row: typeof contextMenu === 'object' ? contextMenu.row !== false : true,
				trigger: (typeof contextMenu === 'object' && contextMenu.trigger) || 'right-click',
				menuPosition: (typeof contextMenu === 'object' && contextMenu.menuPosition) || 'end',
			}
		: null;

	const rightClick = config?.trigger === 'right-click' || config?.trigger === 'both';
	const menuButton = config?.trigger === 'menu-button' || config?.trigger === 'both';
	const headerEnabled = !!config?.header;
	// The row menu has no built-in actions, so it is off until row actions exist.
	const rowEnabled = !!config?.row && !!contextMenuActions?.row;
	const menuButtonPosition = config?.menuPosition ?? 'end';

	// Trigger handlers only record where/what was triggered; menu items are derived
	// at render time so they always reflect current sort/pin/visibility state. Refs
	// keep the handlers' identities stable, which keeps the slices' identities stable.
	const rowActionsRef = React.useRef(contextMenuActions?.row);
	React.useEffect(() => {
		rowActionsRef.current = contextMenuActions?.row;
	});

	const onHeaderContextMenu = React.useCallback((column: TableColumn<T>, e: React.MouseEvent) => {
		e.preventDefault();
		triggerRef.current = e.currentTarget as HTMLElement;
		setMenuState({
			ctx: { type: 'header', column },
			position: { x: e.clientX, y: e.clientY },
			anchorRect: null,
		});
	}, []);

	const onHeaderMenuButtonClick = React.useCallback(
		(column: TableColumn<T>, e: React.MouseEvent<HTMLButtonElement>) => {
			triggerRef.current = e.currentTarget;
			const rect = e.currentTarget.getBoundingClientRect();
			setMenuState({
				ctx: { type: 'header', column },
				position: { x: rect.left, y: rect.bottom + 4 },
				anchorRect: rect,
			});
		},
		[],
	);

	const onRowContextMenu = React.useCallback((row: T, rowIndex: number, e: React.MouseEvent) => {
		const items = rowActionsRef.current?.(row, rowIndex) ?? [];
		// No items for this row — let the native browser menu through.
		if (items.length === 0) return;
		e.preventDefault();
		triggerRef.current = e.currentTarget as HTMLElement;
		setMenuState({
			ctx: { type: 'row', row, rowIndex },
			position: { x: e.clientX, y: e.clientY },
			anchorRect: null,
		});
	}, []);

	const onRowMenuButtonClick = React.useCallback((row: T, rowIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
		const items = rowActionsRef.current?.(row, rowIndex) ?? [];
		if (items.length === 0) return;
		triggerRef.current = e.currentTarget;
		const rect = e.currentTarget.getBoundingClientRect();
		setMenuState({
			ctx: { type: 'row', row, rowIndex },
			position: { x: rect.left, y: rect.bottom + 4 },
			anchorRect: rect,
		});
	}, []);

	// The column captured at trigger time can go stale (pin/hide replace tableColumns),
	// so resolve the live definition by id whenever we read from it.
	const resolveColumn = React.useCallback(
		(column: TableColumn<T>) => tableColumns.find(c => equalizeId(c.id, column.id)) ?? column,
		[tableColumns],
	);

	const openMenu = React.useMemo<OpenContextMenu | null>(() => {
		if (!menuState) return null;
		const { ctx, position, anchorRect } = menuState;

		if (ctx.type === 'row') {
			const items = contextMenuActions?.row?.(ctx.row, ctx.rowIndex) ?? [];
			return { groups: [items], position, anchorRect, ariaLabel: localization.rowMenuAriaLabel ?? 'Row menu' };
		}

		const column = resolveColumn(ctx.column);
		const groups: ContextMenuAction[][] = [];

		if (column.sortable) {
			groups.push([
				{ id: 'sort-asc', label: localization.sortAscLabel ?? 'Sort ascending' },
				{ id: 'sort-desc', label: localization.sortDescLabel ?? 'Sort descending' },
				{ id: 'clear-sort', label: localization.clearSortLabel ?? 'Clear sort', disabled: sortColumns.length === 0 },
			]);
		}

		const columnGroup: ContextMenuAction[] = [];
		// Pinning moves a column to the table edge, which would tear it out of its
		// header group — omit pin actions when column groups are in play.
		if (!columnGroups?.length) {
			if (column.pinned !== 'left')
				columnGroup.push({ id: 'pin-left', label: localization.pinLeftLabel ?? 'Pin left' });
			if (column.pinned !== 'right')
				columnGroup.push({ id: 'pin-right', label: localization.pinRightLabel ?? 'Pin right' });
			if (column.pinned) columnGroup.push({ id: 'unpin', label: localization.unpinLabel ?? 'Unpin' });
		}
		const visibleCount = tableColumns.filter(c => !c.omit).length;
		columnGroup.push({
			id: 'hide-column',
			label: localization.hideColumnLabel ?? 'Hide column',
			disabled: visibleCount <= 1,
		});
		groups.push(columnGroup);
		groups.push([{ id: 'reset', label: localization.resetLabel ?? 'Reset table' }]);

		const custom =
			typeof contextMenuActions?.header === 'function' ? contextMenuActions.header(column) : contextMenuActions?.header;
		if (custom?.length) groups.push(custom);

		return { groups, position, anchorRect, ariaLabel: localization.headerMenuAriaLabel ?? 'Column menu' };
	}, [menuState, contextMenuActions, localization, resolveColumn, sortColumns, columnGroups, tableColumns]);

	const handleMenuClose = React.useCallback((returnFocus: boolean) => {
		setMenuState(null);
		if (returnFocus) triggerRef.current?.focus();
		triggerRef.current = null;
	}, []);

	const handleMenuSelect = React.useCallback(
		(action: ContextMenuAction) => {
			if (!menuState) return;
			const { ctx } = menuState;

			if (ctx.type === 'header') {
				const column = resolveColumn(ctx.column);
				switch (action.id) {
					case 'sort-asc':
					case 'sort-desc':
						onSort({
							type: 'SORT_CHANGE',
							selectedColumn: column,
							additive: false,
							defaultSortDirection,
							direction: action.id === 'sort-asc' ? SortOrder.ASC : SortOrder.DESC,
							clearSelectedOnSort,
						});
						break;
					case 'clear-sort':
						onClearSort();
						break;
					case 'pin-left':
						onPinColumn(column.id!, 'left');
						break;
					case 'pin-right':
						onPinColumn(column.id!, 'right');
						break;
					case 'unpin':
						onPinColumn(column.id!);
						break;
					case 'hide-column':
						onHideColumn(column.id!);
						// A hidden column has no filter icon left, so an active filter
						// would keep filtering with no way to clear it.
						if (filterValues[String(column.id)]) {
							onFilterChange(column.id!, emptyFilterState(column.filterType));
						}
						break;
					case 'reset':
						onResetColumns();
						onClearSort();
						for (const key of Object.keys(filterValues)) {
							const col = tableColumns.find(c => String(c.id) === key);
							onFilterChange(key, emptyFilterState(col?.filterType));
						}
						break;
				}
				onContextMenuAction?.(action, { type: 'header', column });
			} else {
				onContextMenuAction?.(action, ctx);
			}

			handleMenuClose(true);
		},
		[
			menuState,
			resolveColumn,
			onSort,
			defaultSortDirection,
			clearSelectedOnSort,
			onClearSort,
			onPinColumn,
			onHideColumn,
			onResetColumns,
			filterValues,
			tableColumns,
			onFilterChange,
			onContextMenuAction,
			handleMenuClose,
		],
	);

	const headerAriaLabel = localization.headerMenuButtonAriaLabel ?? 'Column actions';
	const rowAriaLabel = localization.rowMenuButtonAriaLabel ?? 'Row actions';

	// Consumers (context dep lists, TableCol's memo) compare slices by reference —
	// keep every field a scalar or a ref-stable callback so identity only changes
	// when the config actually changes.
	const header = React.useMemo<HeaderMenuSlice<T>>(
		() =>
			headerEnabled
				? {
						rightClick,
						menuButton,
						ariaLabel: headerAriaLabel,
						onContextMenu: onHeaderContextMenu,
						onMenuButtonClick: onHeaderMenuButtonClick,
					}
				: null,
		[headerEnabled, rightClick, menuButton, headerAriaLabel, onHeaderContextMenu, onHeaderMenuButtonClick],
	);

	const row = React.useMemo<RowMenuSlice<T>>(
		() =>
			rowEnabled
				? {
						rightClick,
						menuButton,
						menuButtonPosition,
						ariaLabel: rowAriaLabel,
						onContextMenu: onRowContextMenu,
						onMenuButtonClick: onRowMenuButtonClick,
					}
				: null,
		[rowEnabled, rightClick, menuButton, menuButtonPosition, rowAriaLabel, onRowContextMenu, onRowMenuButtonClick],
	);

	return {
		header,
		row,
		open: openMenu,
		onSelect: handleMenuSelect,
		onClose: handleMenuClose,
	};
}
