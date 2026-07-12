import * as React from 'react';
import type { TableColumn, ConditionalStyles } from '../types';
import type { PinnedOffsets } from '../util';
import type { RowMenuSlice } from '../hooks/useContextMenu';
import type { RowEventsSlice } from '../hooks/useRowEvents';
import type { ColumnDragSlice } from '../hooks/useColumns';
import type { ExpansionSlice } from '../hooks/useExpansion';
import type { RowSelectionSlice } from '../hooks/useSelection';

export interface RowContextValue<T> {
	keyField: string;
	columns: TableColumn<T>[];
	dense: boolean;
	striped: boolean;
	highlightOnHover: boolean;
	pointerOnHover: boolean;
	conditionalRowStyles: ConditionalStyles<T>[];
	/** Row selection feature slice — `null` when selectableRows is off. */
	selection: RowSelectionSlice<T>;
	/** Row expansion feature slice — `null` when expandableRows is off. */
	expansion: ExpansionSlice<T>;
	/** Row pointer-event feature slice — compared by reference in the memo dep list. */
	rowEvents: RowEventsSlice<T>;
	/** Column drag/reorder feature slice — body cells are drop targets during column reorder. */
	columnDrag: ColumnDragSlice;
	/** Resized column widths (px) keyed by column.id */
	columnWidths: Record<string | number, number>;
	/** Sticky offsets for pinned columns */
	pinnedOffsets: PinnedOffsets;
	/** Whether to animate rows on mount */
	animateRows: boolean;
	/** Row context-menu feature slice — `null` when the feature is off. Compared by
	 *  reference in the memo dep list; useContextMenu owns identity stability. */
	rowMenu: RowMenuSlice<T>;
	/** Enable spreadsheet-style keyboard navigation between cells. */
	cellNavigation: boolean;
	/**
	 * The roving-tabindex target when `cellNavigation` is on, clamped by DataTable to the
	 * current page and column set so exactly one cell is always a Tab stop. Row `-1` is
	 * the header row; columns count selection/expander cells before data columns.
	 */
	activeCell: ActiveCell | null;
}

export interface ActiveCell {
	row: number;
	col: number;
}

/** Position + Tab-stop state a row passes to its selection/expander cells. */
export interface NavCellProps {
	row: number;
	col: number;
	active: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RowContext = React.createContext<RowContextValue<any> | null>(null);

export function useRowContext<T>(): RowContextValue<T> {
	const ctx = React.useContext(RowContext);
	if (!ctx) throw new Error('useRowContext must be used inside DataTable');
	return ctx as RowContextValue<T>;
}

export { RowContext };
