import * as React from 'react';
import type { SortAction } from '../types';

// Snapshots row Y-positions synchronously before dispatching sort, so
// DataTableBody can FLIP rows from their old positions to the new ones.
export default function useSortFlipAnimation<T>(dispatchSort: (action: SortAction<T>) => void): {
	bodyRef: React.RefObject<HTMLDivElement>;
	prevRowTopsRef: React.MutableRefObject<Map<string | number, number>>;
	handleSort: (action: SortAction<T>) => void;
} {
	const bodyRef = React.useRef<HTMLDivElement>(null);
	const prevRowTopsRef = React.useRef<Map<string | number, number>>(new Map());

	const handleSort = React.useCallback(
		(action: SortAction<T>) => {
			if (bodyRef.current) {
				const snapshot = new Map<string | number, number>();
				bodyRef.current.querySelectorAll<HTMLElement>('[id^="row-"]').forEach(el => {
					snapshot.set(el.id.slice(4), el.getBoundingClientRect().top);
				});
				prevRowTopsRef.current = snapshot;
			}

			dispatchSort(action);
		},
		[dispatchSort],
	);

	return { bodyRef, prevRowTopsRef, handleSort };
}
