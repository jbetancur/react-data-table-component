import * as React from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

type ResizeRef = { columnId: string | number; startX: number; startWidth: number };

type Options = {
	initialColumnWidths?: Record<string | number, number>;
	onColumnResize?: (columnId: string | number, width: number, allWidths: Record<string | number, number>) => void;
};

export default function useColumnResize({ initialColumnWidths, onColumnResize }: Options = {}) {
	const [columnWidths, setColumnWidths] = React.useState<Record<string | number, number>>(initialColumnWidths ?? {});
	const resizeRef = React.useRef<ResizeRef | null>(null);
	const onColumnResizeRef = React.useRef(onColumnResize);
	useIsomorphicLayoutEffect(() => {
		onColumnResizeRef.current = onColumnResize;
	});

	const handleResizeStart = React.useCallback((columnId: string | number, e: React.MouseEvent) => {
		if (typeof document === 'undefined') return;
		e.preventDefault();
		const headerCell = (e.currentTarget as HTMLElement).closest('[data-column-id]') as HTMLElement | null;
		const startWidth = headerCell?.offsetWidth ?? 100;
		resizeRef.current = { columnId, startX: e.clientX, startWidth };

		function onMouseMove(mv: MouseEvent) {
			if (!resizeRef.current) return;
			const { columnId } = resizeRef.current;
			const delta = mv.clientX - resizeRef.current.startX;
			const newWidth = Math.max(40, resizeRef.current.startWidth + delta);
			setColumnWidths(prev => ({ ...prev, [columnId]: newWidth }));
		}

		function onMouseUp() {
			if (resizeRef.current) {
				const { columnId: id } = resizeRef.current;
				setColumnWidths(prev => {
					const w = prev[id];
					if (w != null) onColumnResizeRef.current?.(id, w, prev);
					return prev;
				});
			}
			resizeRef.current = null;
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}, []);

	return { columnWidths, handleResizeStart };
}
