import * as React from 'react';
import type { AllRowsAction, ComponentProps, RangeRowAction, RowState, SingleRowAction } from '../types';

type SelectableComponent = 'input' | React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;

/**
 * Row-selection feature slices — `null` when `selectableRows` is off. Slice
 * identity is the memoization contract: `row` holds only config, stable
 * callbacks, and refs; `selectAll` additionally carries the selection state the
 * header checkbox renders from, so it legitimately changes identity when the
 * selection changes.
 */
export type RowSelectionSlice<T> = {
	component: SelectableComponent;
	componentProps: ComponentProps;
	highlight: boolean;
	single: boolean;
	disabled: RowState<T>;
	range: boolean;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	onSelectedRange: (action: RangeRowAction<T>) => void;
	visibleRowsRef: React.MutableRefObject<T[]>;
	lastSelectedKeyRef: React.MutableRefObject<string | number | null>;
} | null;

export type SelectAllSlice<T> = {
	allSelected: boolean;
	selectedRows: T[];
	visibleRows: T[];
	component: SelectableComponent;
	componentProps: ComponentProps;
	disabled: RowState<T>;
	keyField: string;
	mergeSelections: boolean;
	/** When true the header renders a placeholder instead of the select-all checkbox. */
	hideSelectAll: boolean;
	onSelectAllRows: (action: AllRowsAction<T>) => void;
} | null;

type UseSelectionOptions<T> = {
	selectableRows: boolean;
	component: SelectableComponent;
	componentProps: ComponentProps;
	highlight: boolean;
	single: boolean;
	disabled: RowState<T>;
	range: boolean;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	onSelectedRange: (action: RangeRowAction<T>) => void;
	visibleRowsRef: React.MutableRefObject<T[]>;
	lastSelectedKeyRef: React.MutableRefObject<string | number | null>;
	allSelected: boolean;
	selectedRows: T[];
	visibleRows: T[];
	keyField: string;
	mergeSelections: boolean;
	hideSelectAll: boolean;
	onSelectAllRows: (action: AllRowsAction<T>) => void;
};

export default function useSelection<T>(options: UseSelectionOptions<T>): {
	row: RowSelectionSlice<T>;
	selectAll: SelectAllSlice<T>;
} {
	const {
		selectableRows,
		component,
		componentProps,
		highlight,
		single,
		disabled,
		range,
		onSelectedRow,
		onSelectedRange,
		visibleRowsRef,
		lastSelectedKeyRef,
		allSelected,
		selectedRows,
		visibleRows,
		keyField,
		mergeSelections,
		hideSelectAll,
		onSelectAllRows,
	} = options;

	const row = React.useMemo<RowSelectionSlice<T>>(
		() =>
			selectableRows
				? {
						component,
						componentProps,
						highlight,
						single,
						disabled,
						range,
						onSelectedRow,
						onSelectedRange,
						visibleRowsRef,
						lastSelectedKeyRef,
					}
				: null,
		[
			selectableRows,
			component,
			componentProps,
			highlight,
			single,
			disabled,
			range,
			onSelectedRow,
			onSelectedRange,
			visibleRowsRef,
			lastSelectedKeyRef,
		],
	);

	const selectAll = React.useMemo<SelectAllSlice<T>>(
		() =>
			selectableRows
				? {
						allSelected,
						selectedRows,
						visibleRows,
						component,
						componentProps,
						disabled,
						keyField,
						mergeSelections,
						hideSelectAll,
						onSelectAllRows,
					}
				: null,
		[
			selectableRows,
			allSelected,
			selectedRows,
			visibleRows,
			component,
			componentProps,
			disabled,
			keyField,
			mergeSelections,
			hideSelectAll,
			onSelectAllRows,
		],
	);

	return { row, selectAll };
}
