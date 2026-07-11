import * as React from 'react';
import { SortOrder } from '../types';
import type {
	TableColumn,
	SortAction,
	SortColumn,
	AllRowsAction,
	RowState,
	ComponentProps,
	FilterState,
	Localization,
} from '../types';
import type { PinnedOffsets } from '../util';
import type { ActiveCell } from './RowContext';
import type { HeaderMenuSlice } from '../hooks/useContextMenu';

export interface HeadContextValue<T> {
	// Sort state
	selectedColumn: TableColumn<T>;
	sortDirection: SortOrder;
	sortColumns: SortColumn<T>[];
	sortMulti: boolean;
	defaultSortDirection: SortOrder;
	sortIcon?: React.ReactNode;
	sortServer: boolean;
	// Pagination config (affects sort-reset behaviour)
	pagination: boolean;
	paginationServer: boolean;
	persistSelectedOnSort: boolean;
	// Selection config
	selectableRowsVisibleOnly: boolean;
	keyField: string;
	mergeSelections: boolean;
	allSelected: boolean;
	selectedRows: T[];
	visibleRows: T[];
	selectableRowsComponent: 'input' | React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
	selectableRowsComponentProps: ComponentProps;
	selectableRowDisabled: RowState<T>;
	showSelectAll: boolean;
	// Column resize / drag
	draggingColumnId: string | number;
	draggingGroupKey: string;
	filterValues: Record<string | number, FilterState>;
	localization: NonNullable<Localization['filter']>;
	columnWidths: Record<string | number, number>;
	pinnedOffsets: PinnedOffsets;
	resizable: boolean;
	// Cell navigation (row -1 of the nav grid is the header row)
	cellNavigation: boolean;
	activeCell: ActiveCell | null;
	/** Header context-menu feature slice — `null` when the feature is off. Compared by
	 *  reference in the memo dep list and TableCol's memo; useContextMenu owns identity stability. */
	headerMenu: HeaderMenuSlice<T>;
	// Table state
	progressPending: boolean;
	sortedData: T[];
	fixedHeader: boolean;
	dense: boolean;
	// Callbacks
	onSelectAllRows: (action: AllRowsAction<T>) => void;
	onSort: (action: SortAction<T>) => void;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
	onResizeStart?: (columnId: string | number, e: React.PointerEvent) => void;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
	onGroupPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HeadContext = React.createContext<HeadContextValue<any> | null>(null);

export function useHeadContext<T>(): HeadContextValue<T> {
	const ctx = React.useContext(HeadContext);
	if (!ctx) throw new Error('useHeadContext must be used inside DataTable');
	return ctx as HeadContextValue<T>;
}

export { HeadContext };
