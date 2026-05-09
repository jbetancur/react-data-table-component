import * as React from 'react';

type ResizeRef = { columnId: string | number; startX: number; startWidth: number };

export default function useColumnResize() {
	const [columnWidths, setColumnWidths] = React.useState<Record<string | number, number>>({});
	const resizeRef = React.useRef<ResizeRef | null>(null);

	const handleResizeStart = React.useCallback((columnId: string | number, e: React.MouseEvent) => {
		if (typeof document === 'undefined') return;
		e.preventDefault();
		const headerCell = (e.currentTarget as HTMLElement).closest('[data-column-id]') as HTMLElement | null;
		const startWidth = headerCell?.offsetWidth ?? 100;
		resizeRef.current = { columnId, startX: e.clientX, startWidth };

		function onMouseMove(mv: MouseEvent) {
			if (!resizeRef.current) return;
			const delta = mv.clientX - resizeRef.current.startX;
			const newWidth = Math.max(40, resizeRef.current.startWidth + delta);
			setColumnWidths(prev => ({ ...prev, [resizeRef.current!.columnId]: newWidth }));
		}

		function onMouseUp() {
			resizeRef.current = null;
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}, []);

	return { columnWidths, handleResizeStart };
}
