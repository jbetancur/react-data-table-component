import * as React from 'react';
import { getPrefixColCount } from '../util';
import type { ActiveCell } from '../context/RowContext';
import type { TableColumn } from '../types';

const NAV_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

// Focus the navigable cell at (row, col). Falls back to the nearest column in the same
// row when the exact coordinate has no cell (e.g. a header slot with no bulk action, like
// the expander column). Cells flagged data-nav-widget hand focus to their single
// interactive child — an input/button (row checkbox, expander button) or, for sortable
// headers, the inner columnheader div — so Space/Enter activate it natively and the
// visible focus ring (drawn on the outer cell via :focus-within) still spans the full
// column width instead of just the inner element. A disabled widget falls back to the cell.
function focusNavCell(root: HTMLElement, row: number, col: number): void {
	let cell = root.querySelector<HTMLElement>(`[data-nav-row="${row}"][data-nav-col="${col}"]`);
	if (!cell) {
		let best = Number.POSITIVE_INFINITY;
		root.querySelectorAll<HTMLElement>(`[data-nav-row="${row}"]`).forEach(candidate => {
			const dist = Math.abs(Number(candidate.dataset.navCol) - col);
			if (dist < best) {
				best = dist;
				cell = candidate;
			}
		});
	}
	if (!cell) return;
	const widget = cell.dataset.navWidget
		? cell.querySelector<HTMLElement>('input:not(:disabled), button:not(:disabled), [role="columnheader"]')
		: null;
	(widget ?? cell).focus();
}

export type UseCellNavigationOptions<T> = {
	cellNavigation: boolean;
	selectableRows: boolean;
	expandableRows: boolean;
	expandableRowsHideExpander: boolean;
	effectiveColumns: TableColumn<T>[];
	filteredTableRowCount: number;
	showTableHead: boolean;
};

// The nav grid counts selection/expander cells before data columns; row -1 is the
// header row. The stored active cell is clamped into the current page/column bounds
// so the grid always keeps exactly one Tab stop even when the active row is sorted,
// filtered, or paginated away.
export default function useCellNavigation<T>({
	cellNavigation,
	selectableRows,
	expandableRows,
	expandableRowsHideExpander,
	effectiveColumns,
	filteredTableRowCount,
	showTableHead,
}: UseCellNavigationOptions<T>) {
	const [activeCell, setActiveCell] = React.useState<ActiveCell | null>(null);

	const navPrefixCols = getPrefixColCount(selectableRows, expandableRows, expandableRowsHideExpander);
	const totalNavCols = navPrefixCols + effectiveColumns.filter(c => !c.omit).length;
	const navMinRow = showTableHead ? -1 : 0;
	const navMaxRow = filteredTableRowCount - 1;

	const effectiveActiveCell = React.useMemo((): ActiveCell | null => {
		if (!cellNavigation || totalNavCols === 0 || navMaxRow < navMinRow) return null;
		const base = activeCell ?? { row: navMaxRow >= 0 ? 0 : navMinRow, col: 0 };
		return {
			row: Math.min(Math.max(base.row, navMinRow), navMaxRow),
			col: Math.min(Math.max(base.col, 0), totalNavCols - 1),
		};
	}, [cellNavigation, activeCell, navMinRow, navMaxRow, totalNavCols]);

	const handleNavFocus = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
		const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-row]');
		if (!cell) return;
		const row = Number(cell.dataset.navRow);
		const col = Number(cell.dataset.navCol);
		setActiveCell(prev => (prev && prev.row === row && prev.col === col ? prev : { row, col }));
	}, []);

	const handleNavKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.defaultPrevented) return;
			if (!NAV_KEYS.includes(e.key) && e.key !== ' ') return;
			const target = e.target as HTMLElement;
			const cell = target.closest<HTMLElement>('[data-nav-row]');
			if (!cell) return;

			// Space on a focused cell wrapper would scroll the page; swallow it. Widgets and
			// editors handle Space themselves and preventDefault before it bubbles here.
			if (e.key === ' ') {
				if (target === cell) e.preventDefault();
				return;
			}

			// Don't hijack arrows from text-entry widgets (open editors, custom cell content).
			const tag = target.tagName;
			if (target.isContentEditable || tag === 'TEXTAREA' || tag === 'SELECT') return;
			if (tag === 'INPUT' && !['checkbox', 'radio', 'button'].includes((target as HTMLInputElement).type)) return;
			if (target.closest('.rdt_editCustomWrap')) return;

			const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
			const row = Number(cell.dataset.navRow);
			const col = Number(cell.dataset.navCol);
			let nextRow = row;
			let nextCol = col;

			switch (e.key) {
				case 'ArrowRight':
					nextCol += rtl ? -1 : 1;
					break;
				case 'ArrowLeft':
					nextCol += rtl ? 1 : -1;
					break;
				case 'ArrowDown':
					nextRow += 1;
					break;
				case 'ArrowUp':
					nextRow -= 1;
					break;
				case 'Home':
					nextCol = 0;
					if (e.ctrlKey || e.metaKey) nextRow = navMaxRow >= 0 ? 0 : navMinRow;
					break;
				case 'End':
					nextCol = totalNavCols - 1;
					if (e.ctrlKey || e.metaKey) nextRow = navMaxRow >= 0 ? navMaxRow : navMinRow;
					break;
			}

			nextRow = Math.min(Math.max(nextRow, navMinRow), Math.max(navMaxRow, navMinRow));
			nextCol = Math.min(Math.max(nextCol, 0), Math.max(totalNavCols - 1, 0));
			e.preventDefault();
			if (nextRow === row && nextCol === col) return;
			focusNavCell(e.currentTarget, nextRow, nextCol);
		},
		[navMinRow, navMaxRow, totalNavCols],
	);

	return { activeCell: effectiveActiveCell, handleNavFocus, handleNavKeyDown };
}
