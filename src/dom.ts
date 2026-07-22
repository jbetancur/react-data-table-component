/** DOM-touching helpers (drag ghosts, FLIP animations). Kept out of util.ts so
 * that module stays pure logic. */

// Tracks the in-flight cleanup for each animating element so a re-sort mid-flight
// tears down the previous transition instead of leaking its listener and styles.
const flipCleanups = new WeakMap<HTMLElement, () => void>();

/** FLIP: element has already moved to its new layout position; start it offset
 * by `delta` (its old position) and transition back to rest. */
export function flipElement(el: HTMLElement, delta: number, axis: 'X' | 'Y', duration: number): void {
	// If a prior FLIP on this element is still running, cancel it first so its
	// transitionend can't fire late and its styles can't linger.
	flipCleanups.get(el)?.();

	el.style.transform = `translate${axis}(${delta}px)`;
	el.style.transition = 'none';
	el.getBoundingClientRect(); // force reflow so the offset applies before transitioning
	el.style.transition = `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
	el.style.transform = '';
	const cleanup = () => {
		el.style.transform = '';
		el.style.transition = '';
		el.removeEventListener('transitionend', cleanup);
		flipCleanups.delete(el);
	};
	flipCleanups.set(el, cleanup);
	el.addEventListener('transitionend', cleanup);
}

const DRAG_GHOST_ICON =
	'<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><circle cx="5" cy="3.5" r="1.2"/><circle cx="11" cy="3.5" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/><circle cx="5" cy="12.5" r="1.2"/><circle cx="11" cy="12.5" r="1.2"/></svg>';

/** Replaces the browser's default drag image with a grip-icon + label ghost sized to the dragged cell. */
export function setDragGhost(e: React.DragEvent<HTMLElement>, label: string): void {
	e.dataTransfer.effectAllowed = 'move';
	const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
	const ghost = document.createElement('div');
	ghost.className = 'rdt_dragGhost';
	const icon = document.createElement('span');
	icon.className = 'rdt_dragGhostIcon';
	icon.setAttribute('aria-hidden', 'true');
	icon.innerHTML = DRAG_GHOST_ICON;
	const labelSpan = document.createElement('span');
	labelSpan.className = 'rdt_dragGhostLabel';
	labelSpan.textContent = label;
	ghost.appendChild(icon);
	ghost.appendChild(labelSpan);
	ghost.style.width = `${rect.width}px`;
	ghost.style.height = `${rect.height}px`;
	document.body.appendChild(ghost);
	e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, e.clientY - rect.top);
	setTimeout(() => document.body.removeChild(ghost), 0);
}
