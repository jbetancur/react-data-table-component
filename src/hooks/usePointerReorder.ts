import * as React from 'react';

type Mode = 'column' | 'group';

type UsePointerReorderOptions = {
	onGrab: (mode: Mode, id: string) => void;
	onMove: (mode: Mode, targetId: string) => void;
	onRelease: (mode: Mode) => void;
};

const LONG_PRESS_MS = 250;
const MODE_ATTR: Record<Mode, string> = { column: 'data-column-id', group: 'data-group-key' };

/**
 * Pointer-driven (touch/pen) column and group reorder. HTML5 drag-and-drop never
 * fires from touch, so this drives the same reorder logic from pointer events:
 * a long-press grabs the header (so a normal touch still scrolls), pointermove
 * hit-tests the element under the finger, pointerup/cancel releases.
 * Mouse pointers are ignored — desktop keeps the native DnD path.
 */
export default function usePointerReorder({ onGrab, onMove, onRelease }: UsePointerReorderOptions) {
	// The document listeners live across renders; route them through a ref so they
	// always see the latest callbacks (onMove closes over current column state).
	const callbacks = React.useRef({ onGrab, onMove, onRelease });
	React.useEffect(() => {
		callbacks.current = { onGrab, onMove, onRelease };
	}, [onGrab, onMove, onRelease]);

	const drag = React.useRef<{
		pointerId: number;
		longPressTimer: ReturnType<typeof setTimeout>;
		active: boolean;
		cleanup: () => void;
	} | null>(null);

	const start = React.useCallback((mode: Mode, e: React.PointerEvent<HTMLDivElement>) => {
		if (typeof document === 'undefined') return;
		if (e.pointerType === 'mouse') return;
		const id = (e.currentTarget as HTMLElement).getAttribute(MODE_ATTR[mode]);
		if (!id) return;

		const pointerId = e.pointerId;

		function onPointerMove(mv: PointerEvent) {
			const state = drag.current;
			if (!state || mv.pointerId !== state.pointerId || !state.active) return;
			mv.preventDefault();
			const under = document.elementFromPoint(mv.clientX, mv.clientY);
			const target = under?.closest(`[${MODE_ATTR[mode]}]`)?.getAttribute(MODE_ATTR[mode]);
			if (target) callbacks.current.onMove(mode, target);
		}

		function end() {
			const state = drag.current;
			if (!state) return;
			clearTimeout(state.longPressTimer);
			callbacks.current.onRelease(mode);
			document.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener('pointerup', end);
			document.removeEventListener('pointercancel', end);
			drag.current = null;
		}

		const longPressTimer = setTimeout(() => {
			const state = drag.current;
			if (!state) return;
			state.active = true;
			callbacks.current.onGrab(mode, id);
		}, LONG_PRESS_MS);

		drag.current = { pointerId, longPressTimer, active: false, cleanup: end };

		document.addEventListener('pointermove', onPointerMove, { passive: false });
		document.addEventListener('pointerup', end);
		document.addEventListener('pointercancel', end);
	}, []);

	// Tear down an in-flight drag on unmount so it can't leak the document
	// listeners or a pending long-press timer.
	React.useEffect(
		() => () => {
			drag.current?.cleanup();
		},
		[],
	);

	const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => start('column', e), [start]);
	const handleGroupPointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => start('group', e),
		[start],
	);

	return { handlePointerDown, handleGroupPointerDown };
}
