import * as React from 'react';

/**
 * Row pointer-event feature slice. Always present (the callbacks default to
 * noops). Slice identity is the memoization contract — it changes only when a
 * consumer-supplied callback changes identity, same as the flat fields did.
 */
export type RowEventsSlice<T> = {
	onRowClicked: (row: T, e: React.MouseEvent) => void;
	onRowDoubleClicked: (row: T, e: React.MouseEvent) => void;
	onRowMiddleClicked: (row: T, e: React.MouseEvent) => void;
	onRowMouseEnter: (row: T, e: React.MouseEvent) => void;
	onRowMouseLeave: (row: T, e: React.MouseEvent) => void;
};

export default function useRowEvents<T>(events: RowEventsSlice<T>): RowEventsSlice<T> {
	const { onRowClicked, onRowDoubleClicked, onRowMiddleClicked, onRowMouseEnter, onRowMouseLeave } = events;
	return React.useMemo(
		() => ({ onRowClicked, onRowDoubleClicked, onRowMiddleClicked, onRowMouseEnter, onRowMouseLeave }),
		[onRowClicked, onRowDoubleClicked, onRowMiddleClicked, onRowMouseEnter, onRowMouseLeave],
	);
}
