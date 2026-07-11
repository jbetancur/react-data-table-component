import * as React from 'react';
import '../DataTable.css';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import type { ContextMenuAction } from '../types';

type ContextMenuProps = {
	/** Menu items in groups — a separator renders between groups. */
	groups: ContextMenuAction[][];
	/** Viewport coordinates (clientX/clientY of the triggering event). */
	position: { x: number; y: number };
	/** When the menu was opened from a kebab button, its rect — the menu aligns to it. */
	anchorRect?: DOMRect | null;
	isRTL: boolean;
	ariaLabel: string;
	onSelect: (action: ContextMenuAction) => void;
	onClose: (returnFocus: boolean) => void;
};

export default function ContextMenu({
	groups,
	position,
	anchorRect,
	isRTL,
	ariaLabel,
	onSelect,
	onClose,
}: ContextMenuProps): JSX.Element {
	const menuRef = React.useRef<HTMLDivElement>(null);

	// Position after first paint: clamp within the viewport, flip above when there is
	// no room below, and align to the anchor's inline edge in RTL. Written straight to
	// the element to avoid a re-render flash.
	useIsomorphicLayoutEffect(() => {
		const el = menuRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const margin = 8;
		let left = anchorRect ? (isRTL ? anchorRect.right - rect.width : anchorRect.left) : position.x;
		let top = anchorRect ? anchorRect.bottom + 4 : position.y;
		if (left + rect.width > window.innerWidth - margin) left = window.innerWidth - rect.width - margin;
		left = Math.max(margin, left);
		if (top + rect.height > window.innerHeight - margin) {
			const flipped = (anchorRect ? anchorRect.top - 4 : position.y) - rect.height;
			top = flipped >= margin ? flipped : Math.max(margin, window.innerHeight - rect.height - margin);
		}
		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
		el.style.visibility = 'visible';
	}, [position, anchorRect, isRTL]);

	React.useEffect(() => {
		const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
		first?.focus();

		function handleOutside(e: Event) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose(false);
		}
		// The menu is position: fixed, so any scroll moves the anchor out from under it —
		// close rather than track (same behaviour as the column filter panel).
		function handleScroll(e: Event) {
			if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return;
			onClose(false);
		}
		function handleResize() {
			onClose(false);
		}

		document.addEventListener('pointerdown', handleOutside);
		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleResize);
		return () => {
			document.removeEventListener('pointerdown', handleOutside);
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleResize);
		};
	}, [onClose]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') {
			e.stopPropagation();
			onClose(true);
			return;
		}
		if (e.key === 'Tab') {
			onClose(false);
			return;
		}
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
		e.preventDefault();

		const items = Array.from(
			menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [],
		);
		if (items.length === 0) return;
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);
		let nextIndex: number;
		if (e.key === 'Home') nextIndex = 0;
		else if (e.key === 'End') nextIndex = items.length - 1;
		else if (e.key === 'ArrowDown') nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
		else nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
		items[nextIndex].focus();
	};

	const renderedGroups = groups.filter(g => g.length > 0);

	return (
		<div
			ref={menuRef}
			className="rdt_contextMenu"
			role="menu"
			aria-label={ariaLabel}
			tabIndex={-1}
			// Positioned by the layout effect above; hidden until then to avoid a flash at 0,0.
			style={{ position: 'fixed', top: position.y, left: position.x, visibility: 'hidden' }}
			onKeyDown={handleKeyDown}
			onContextMenu={e => e.preventDefault()}
		>
			{renderedGroups.map((group, groupIndex) => (
				<React.Fragment key={groupIndex}>
					{groupIndex > 0 && <div className="rdt_contextMenuSeparator" role="separator" />}
					{group.map(action => (
						<button
							key={action.id}
							type="button"
							role="menuitem"
							className="rdt_contextMenuItem"
							tabIndex={-1}
							disabled={action.disabled}
							aria-disabled={action.disabled || undefined}
							onClick={() => onSelect(action)}
						>
							{action.icon && (
								<span className="rdt_contextMenuItemIcon" aria-hidden="true">
									{action.icon}
								</span>
							)}
							{action.label}
						</button>
					))}
				</React.Fragment>
			))}
		</div>
	);
}
