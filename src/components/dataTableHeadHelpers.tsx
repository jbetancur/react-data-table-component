import * as React from 'react';
import type { TableColumn, ColumnGroup } from '../types';

/**
 * Builds the CSS grid-template-columns string from the visible column definitions.
 * Prefix columns (checkbox/expander) use the --rdt-system-col-width var so
 * themes can override the system column width without code changes.
 * columnWidths contains user-resized overrides and takes precedence.
 */
export function buildGridTemplateColumns<T>(
	visibleColumns: TableColumn<T>[],
	prefixColCount: number,
	columnWidths: Record<string | number, number>,
): string {
	const tracks: string[] = [];
	for (let i = 0; i < prefixColCount; i++) tracks.push('var(--rdt-system-col-width, 48px)');
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

export interface GroupDragProps {
	draggingGroupKey: string;
	onGroupDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onGroupPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
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
	groupDragProps?: GroupDragProps,
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
				const groupKey = String(group.columnIds[0]);
				const isDragging = groupDragProps?.draggingGroupKey === groupKey;
				cells.push(
					<div
						key={groupKey}
						className={['rdt_groupCell', group.reorder && 'rdt_groupCellReorder', isDragging && 'rdt_groupCellDragging']
							.filter(Boolean)
							.join(' ')}
						draggable={group.reorder || undefined}
						data-group-key={group.reorder ? groupKey : undefined}
						onDragStart={group.reorder ? groupDragProps?.onGroupDragStart : undefined}
						onDragEnter={group.reorder ? groupDragProps?.onGroupDragEnter : undefined}
						onDragOver={group.reorder ? groupDragProps?.onGroupDragOver : undefined}
						onDragEnd={group.reorder ? groupDragProps?.onGroupDragEnd : undefined}
						onPointerDown={group.reorder ? groupDragProps?.onGroupPointerDown : undefined}
						style={{
							gridColumn: `${gridColStart} / ${gridColEnd}`,
							gridRow: '1',
							...(isDragging ? { opacity: 0.5 } : undefined),
							...(group.align && group.align !== 'center'
								? { justifyContent: group.align === 'right' ? 'flex-end' : 'flex-start' }
								: undefined),
						}}
					>
						{group.reorder ? <span style={{ pointerEvents: 'none' }}>{group.name}</span> : group.name}
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
