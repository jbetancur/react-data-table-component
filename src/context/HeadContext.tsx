import * as React from 'react';
import type { FilteringSlice } from '../hooks/useColumnFilter';
import type { PinnedOffsets } from '../util';
import type { ActiveCell } from './RowContext';
import type { HeaderMenuSlice } from '../hooks/useContextMenu';
import type { ColumnDragSlice } from '../hooks/useColumns';
import type { ResizeSlice } from '../hooks/useColumnResize';
import type { SelectAllSlice } from '../hooks/useSelection';
import type { SortingSlice } from '../hooks/useSorting';

export interface HeadContextValue<T> {
	/** Sorting feature slice — `sortColumns` inside it changes identity per sort
	 *  interaction; TableCol's memo does per-column checks within the slice. */
	sorting: SortingSlice<T>;
	/** Select-all feature slice — `null` when selectableRows is off. Carries the
	 *  selection state the header checkbox renders from, so its identity changes
	 *  with the selection (legitimate re-render). */
	selectAll: SelectAllSlice<T>;
	// Volatile column-drag state — stays flat so the columnDrag slice stays stable (invariant 4)
	draggingColumnId: string | number;
	draggingGroupKey: string;
	/** Column-filter feature slice — `filterValues` inside it changes per applied filter. */
	filtering: FilteringSlice;
	columnWidths: Record<string | number, number>;
	pinnedOffsets: PinnedOffsets;
	/** Column-resize feature slice — `null` when `resizable` is off. */
	resize: ResizeSlice;
	// Cell navigation (row -1 of the nav grid is the header row)
	cellNavigation: boolean;
	activeCell: ActiveCell | null;
	/** Header context-menu feature slice — `null` when the feature is off. Compared by
	 *  reference in the memo dep list and TableCol's memo; useContextMenu owns identity stability. */
	headerMenu: HeaderMenuSlice<T>;
	fixedHeader: boolean;
	dense: boolean;
	/** Column drag/reorder feature slice — shared with RowContext. */
	columnDrag: ColumnDragSlice;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HeadContext = React.createContext<HeadContextValue<any> | null>(null);

export function useHeadContext<T>(): HeadContextValue<T> {
	const ctx = React.useContext(HeadContext);
	if (!ctx) throw new Error('useHeadContext must be used inside DataTable');
	return ctx as HeadContextValue<T>;
}

export { HeadContext };
