import * as React from 'react';
import { buildCellStyle } from './Cell';
import { TableColumn, ColumnGroup } from '../types';

/**
 * Builds the CSS grid-template-columns string from the visible column definitions.
 * Prefix columns (checkbox/expander) are always 48px.
 * columnWidths contains user-resized overrides and takes precedence.
 */
export function buildGridTemplateColumns<T>(
	visibleColumns: TableColumn<T>[],
	prefixColCount: number,
	columnWidths: Record<string | number, number>,
): string {
	const tracks: string[] = [];
	for (let i = 0; i < prefixColCount; i++) tracks.push('48px');
	for (const col of visibleColumns) {
		const resized = col.id != null ? columnWidths[col.id] : undefined;
		if (resized != null) {
			tracks.push(`${resized}px`);
		} else if (col.width) {
			tracks.push(col.width);
		} else if (col.grow === 0 || col.button) {
			tracks.push(`minmax(${col.minWidth ?? '48px'}, max-content)`);
		} else {
			tracks.push(`minmax(${col.minWidth ?? '100px'}, ${col.grow ?? 1}fr)`);
		}
	}
	return tracks.join(' ');
}

/**
 * Builds the group label cells for row 1 of the CSS grid.
 * Rendered AFTER column header cells in the DOM so that the CSS + sibling
 * selector for column separators (rdt_cellBaseHead + rdt_cellBaseHead) is
 * not broken by group cells appearing between column cells in DOM order.
 * Visual placement is controlled entirely by gridColumn / gridRow.
 */
export function buildGroupHeaderCells<T>(
	visibleColumns: TableColumn<T>[],
	columnGroups: ColumnGroup[],
	ungroupedIds: Set<string>,
	groupColSpans: Record<string, number>,
	prefixColCount: number,
): React.ReactNode[] {
	const cells: React.ReactNode[] = [];
	let colIdx = 0;

	while (colIdx < visibleColumns.length) {
		const col = visibleColumns[colIdx];
		const colId = String(col.id);

		if (ungroupedIds.has(colId)) {
			// Ungrouped column header spans both rows — no group label cell needed.
			colIdx++;
		} else {
			const group = columnGroups.find(g => g.columnIds.map(String).includes(colId));
			if (group) {
				const span = groupColSpans[String(group.name)] ?? 1;
				const gridColStart = prefixColCount + colIdx + 1;
				const gridColEnd = gridColStart + span;
				cells.push(
					<div
						key={String(group.name) + colIdx}
						className="rdt_groupCell"
						style={{
							gridColumn: `${gridColStart} / ${gridColEnd}`,
							gridRow: '1',
							...(group.align && group.align !== 'center'
								? { justifyContent: group.align === 'right' ? 'flex-end' : 'flex-start' }
								: undefined),
						}}
					>
						{group.name}
					</div>,
				);
				colIdx += span;
			} else {
				colIdx++;
			}
		}
	}
	return cells;
}

/**
 * Legacy flex-row helper — used when there are no columnGroups in grid mode.
 */
export function buildGroupCells<T>(
	visibleColumns: TableColumn<T>[],
	columnGroups: ColumnGroup[],
	ungroupedIds: Set<string>,
	groupColSpans: Record<string, number>,
): React.ReactNode[] {
	const cells: React.ReactNode[] = [];
	let colIdx = 0;

	while (colIdx < visibleColumns.length) {
		const col = visibleColumns[colIdx];
		const colId = String(col.id);

		if (ungroupedIds.has(colId)) {
			cells.push(
				<div
					key={colId}
					className="rdt_cellBase rdt_cellBaseHead rdt_groupCell rdt_groupCellSpacer"
					style={buildCellStyle(col)}
				/>,
			);
			colIdx++;
		} else {
			const group = columnGroups.find(g => g.columnIds.map(String).includes(colId));
			if (group) {
				const span = groupColSpans[String(group.name)] ?? 1;
				const childCols = visibleColumns.slice(colIdx, colIdx + span);
				const totalGrow = childCols.reduce((sum, c) => {
					const s = buildCellStyle(c);
					return sum + (typeof s.flexGrow === 'number' ? s.flexGrow : 1);
				}, 0);
				const groupStyle: React.CSSProperties = childCols.every(c => c.width)
					? { flex: `0 0 ${childCols.reduce((sum, c) => sum + parseFloat(c.width!), 0)}px`, minWidth: 0 }
					: { flex: `${totalGrow} 0 0`, minWidth: 0 };

				cells.push(
					<div
						key={String(group.name) + colIdx}
						className="rdt_cellBase rdt_cellBaseHead rdt_groupCell"
						style={groupStyle}
					>
						{group.name}
					</div>,
				);
				colIdx += span;
			} else {
				colIdx++;
			}
		}
	}
	return cells;
}
