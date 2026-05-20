import * as React from 'react';
import type {
	TableColumn,
	ConditionalStyles,
	ExpandableIcon,
	ExpandableRowsComponent,
	Localization,
	RowState,
	SingleRowAction,
	RangeRowAction,
	ComponentProps,
} from '../types';
import type { PinnedOffsets } from '../util';

export interface RowContextValue<T> {
	keyField: string;
	columns: TableColumn<T>[];
	dense: boolean;
	striped: boolean;
	highlightOnHover: boolean;
	pointerOnHover: boolean;
	conditionalRowStyles: ConditionalStyles<T>[];
	selectableRows: boolean;
	selectableRowsComponent: 'input' | React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
	selectableRowsComponentProps: ComponentProps;
	selectableRowsHighlight: boolean;
	selectableRowsSingle: boolean;
	selectableRowDisabled: RowState<T>;
	expandableRows: boolean;
	expandableIcon: ExpandableIcon;
	localization: NonNullable<Localization['expandable']>;
	expandableRowsComponent: ExpandableRowsComponent<T> | undefined;
	expandableRowsComponentProps: ComponentProps | undefined;
	expandableRowsHideExpander: boolean;
	expandOnRowClicked: boolean;
	expandOnRowDoubleClicked: boolean;
	expandableInheritConditionalStyles: boolean;
	onRowClicked: (row: T, e: React.MouseEvent) => void;
	onRowDoubleClicked: (row: T, e: React.MouseEvent) => void;
	onRowMiddleClicked: (row: T, e: React.MouseEvent) => void;
	onRowMouseEnter: (row: T, e: React.MouseEvent) => void;
	onRowMouseLeave: (row: T, e: React.MouseEvent) => void;
	onRowExpandToggled: (expanded: boolean, row: T) => void;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	/** Dispatch a range selection (Shift-click). */
	onSelectedRange: (action: RangeRowAction<T>) => void;
	/** Ref to the rows currently visible in order — used to compute range slices. */
	visibleRowsRef: React.MutableRefObject<T[]>;
	/** Ref to the last single-toggled key, the anchor for Shift-click ranges. */
	lastSelectedKeyRef: React.MutableRefObject<string | number | null>;
	/** Whether Shift-click range selection is enabled. */
	selectableRowsRange: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	/** Resized column widths (px) keyed by column.id */
	columnWidths: Record<string | number, number>;
	/** Sticky offsets for pinned columns */
	pinnedOffsets: PinnedOffsets;
	/** Whether to animate rows on mount */
	animateRows: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RowContext = React.createContext<RowContextValue<any> | null>(null);

export function useRowContext<T>(): RowContextValue<T> {
	const ctx = React.useContext(RowContext);
	if (!ctx) throw new Error('useRowContext must be used inside DataTable');
	return ctx as RowContextValue<T>;
}

export { RowContext };
