import * as React from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

type ResizeRef = { columnId: string | number; startX: number; startWidth: number; minWidth: number };

export type UseColumnResizeOptions = {
	initialColumnWidths?: Record<string | number, number>;
	onColumnResize?: (columnId: string | number, width: number, allWidths: Record<string | number, number>) => void;
	isRTL?: boolean;
};

export default function useColumnResize({
	initialColumnWidths,
	onColumnResize,
	isRTL = false,
}: UseColumnResizeOptions = {}) {
	const [columnWidths, setColumnWidths] = React.useState<Record<string | number, number>>(initialColumnWidths ?? {});
	const resizeRef = React.useRef<ResizeRef | null>(null);
	const onColumnResizeRef = React.useRef(onColumnResize);
	const isRTLRef = React.useRef(isRTL);
	useIsomorphicLayoutEffect(() => {
		onColumnResizeRef.current = onColumnResize;
		isRTLRef.current = isRTL;
	});

	const handleResizeStart = React.useCallback(
		(columnId: string | number, e: React.PointerEvent, configuredMinWidth?: string) => {
			if (typeof document === 'undefined') return;
			e.preventDefault();
			const headerCell = (e.currentTarget as HTMLElement).closest('[data-column-id]') as HTMLElement | null;
			const startWidth = headerCell?.offsetWidth ?? 100;
			const configuredMin = configuredMinWidth != null ? Number.parseFloat(configuredMinWidth) : Number.NaN;
			resizeRef.current = {
				columnId,
				startX: e.clientX,
				startWidth,
				minWidth: Math.max(40, Number.isFinite(configuredMin) ? configuredMin : 0),
			};

			function onPointerMove(mv: PointerEvent) {
				if (!resizeRef.current) return;
				const { columnId } = resizeRef.current;
				// In RTL the handle sits on the column's left (end) edge, so dragging left
				// (negative clientX delta) should widen the column — invert the delta.
				const delta = (mv.clientX - resizeRef.current.startX) * (isRTLRef.current ? -1 : 1);
				const newWidth = Math.max(resizeRef.current.minWidth, resizeRef.current.startWidth + delta);
				setColumnWidths(prev => ({ ...prev, [columnId]: newWidth }));
			}

			function onPointerUp() {
				if (resizeRef.current) {
					const { columnId: id } = resizeRef.current;
					setColumnWidths(prev => {
						const w = prev[id];
						if (w != null) onColumnResizeRef.current?.(id, w, prev);
						return prev;
					});
				}
				resizeRef.current = null;
				document.removeEventListener('pointermove', onPointerMove);
				document.removeEventListener('pointerup', onPointerUp);
			}

			document.addEventListener('pointermove', onPointerMove);
			document.addEventListener('pointerup', onPointerUp);
		},
		[],
	);

	return { columnWidths, handleResizeStart };
}

/** Column-resize feature slice — `null` when `resizable` is off. Internal: the
 *  public `useColumnResize` return shape is exported API and stays untouched. */
export type ResizeSlice = {
	onResizeStart: (columnId: string | number, e: React.PointerEvent, configuredMinWidth?: string) => void;
} | null;

export function useResizeSlice(
	resizable: boolean,
	onResizeStart: (columnId: string | number, e: React.PointerEvent, configuredMinWidth?: string) => void,
): ResizeSlice {
	// Identity is load-bearing: compared by reference in the head context dep list.
	return React.useMemo(() => (resizable ? { onResizeStart } : null), [resizable, onResizeStart]);
}
