import * as React from 'react';
import { decorateColumns, findColumnIndexById, getPinZoneForIndex, getSortDirection, normalizePins } from '../util';
import { setDragGhost } from '../dom';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import { SortOrder } from '../types';
import type { TableColumn, ColumnGroup } from '../types';

type ColumnsHook<T> = {
	tableColumns: TableColumn<T>[];
	tableGroups: ColumnGroup[];
	draggingColumnId: string;
	draggingGroupKey: string;
	handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	handleGroupDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	handleGroupDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	handleGroupDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	handleGroupDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	defaultSortDirection: SortOrder;
	defaultSortColumn: TableColumn<T>;
};

/** Swaps two group blocks within the columns array, preserving ungrouped column positions. */
export function swapGroupBlocks<T>(
	columns: TableColumn<T>[],
	srcIds: Set<string>,
	tgtIds: Set<string>,
): TableColumn<T>[] {
	const result: TableColumn<T>[] = [];
	const srcCols = columns.filter(c => srcIds.has(String(c.id)));
	const tgtCols = columns.filter(c => tgtIds.has(String(c.id)));
	let insertedSrc = false;
	let insertedTgt = false;

	for (const col of columns) {
		const colId = String(col.id);
		if (srcIds.has(colId)) {
			if (!insertedSrc) {
				result.push(...tgtCols);
				insertedSrc = true;
			}
		} else if (tgtIds.has(colId)) {
			if (!insertedTgt) {
				result.push(...srcCols);
				insertedTgt = true;
			}
		} else {
			result.push(col);
		}
	}

	return result;
}

function useColumns<T>(
	columns: TableColumn<T>[],
	onColumnOrderChange: (nextOrder: TableColumn<T>[]) => void,
	onColumnGroupOrderChange: ((nextGroups: ColumnGroup[], nextColumns: TableColumn<T>[]) => void) | undefined,
	columnGroups: ColumnGroup[] | undefined,
	defaultSortFieldId: string | number | null | undefined,
	defaultSortAsc: boolean,
): ColumnsHook<T> {
	const [tableColumns, setTableColumns] = React.useState<TableColumn<T>[]>(() => decorateColumns(columns));
	const [tableGroups, setTableGroups] = React.useState<ColumnGroup[]>(() => columnGroups ?? []);
	const [draggingColumnId, setDraggingColumn] = React.useState('');
	const [draggingGroupKey, setDraggingGroupKey] = React.useState('');
	const sourceColumnId = React.useRef('');
	const sourceGroupKey = React.useRef('');
	const isDraggingGroup = React.useRef(false);

	useDidUpdateEffect(() => {
		setTableColumns(decorateColumns(columns));
	}, [columns]);

	useDidUpdateEffect(() => {
		setTableGroups(columnGroups ?? []);
	}, [columnGroups]);

	// ── Per-column drag handlers ───────────────────────────────────────────────

	const handleDragStart = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			if (isDraggingGroup.current) return;
			const { attributes } = e.target as HTMLDivElement;
			const id = attributes.getNamedItem('data-column-id')?.value;

			if (id) {
				sourceColumnId.current = tableColumns[findColumnIndexById(tableColumns, id)]?.id?.toString() || '';
				setDraggingColumn(sourceColumnId.current);
			}
		},
		[tableColumns],
	);

	const handleDragEnter = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			if (isDraggingGroup.current) return;
			const el = e.currentTarget as HTMLDivElement;
			// Skip events that bubble from child elements within this same cell
			if (el.contains(e.relatedTarget as Node)) return;
			const id = el.getAttribute('data-column-id');
			if (!id || !sourceColumnId.current || id === sourceColumnId.current) return;

			// When groups exist, only allow reorder within the same group
			if (tableGroups.length > 0) {
				const srcGroupIds =
					tableGroups.find(g => g.columnIds.some(cid => String(cid) === sourceColumnId.current))?.columnIds ?? [];
				if (!srcGroupIds.some(cid => String(cid) === id)) return;
			}

			const srcIdx = findColumnIndexById(tableColumns, sourceColumnId.current);
			const tgtIdx = findColumnIndexById(tableColumns, id);
			const moved = [...tableColumns];
			const [col] = moved.splice(srcIdx, 1);
			moved.splice(tgtIdx, 0, col);

			const leftCount = moved.filter(c => c.pinned === 'left').length;
			const rightCount = moved.filter(c => c.pinned === 'right').length;

			const pinZoneMap: Record<number, 'left' | 'right' | undefined> = {};
			for (let i = 0; i < moved.length; i++) {
				pinZoneMap[i] = getPinZoneForIndex(i, leftCount, rightCount, moved.length);
			}

			const reorderedCols = normalizePins(moved, pinZoneMap);
			setTableColumns(reorderedCols);
			onColumnOrderChange(reorderedCols);
		},
		[onColumnOrderChange, tableColumns, tableGroups],
	);

	const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleDragEnd = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		sourceColumnId.current = '';
		setDraggingColumn('');
	}, []);

	// ── Group-level drag handlers ──────────────────────────────────────────────

	const handleGroupDragStart = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			const el = e.currentTarget as HTMLDivElement;
			const key = el.getAttribute('data-group-key');
			if (key) {
				isDraggingGroup.current = true;
				sourceGroupKey.current = key;
				setDraggingGroupKey(key);

				const group = tableGroups.find(g => String(g.columnIds[0]) === key);
				setDragGhost(e, typeof group?.name === 'string' ? group.name : '');
			}
		},
		[tableGroups],
	);

	const handleGroupDragEnter = React.useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const el = e.currentTarget as HTMLDivElement;
			if (el.contains(e.relatedTarget as Node)) return;
			const key = el.getAttribute('data-group-key');
			if (!key || !sourceGroupKey.current || key === sourceGroupKey.current) return;

			const srcGroup = tableGroups.find(g => String(g.columnIds[0]) === sourceGroupKey.current);
			const tgtGroup = tableGroups.find(g => String(g.columnIds[0]) === key);
			if (!srcGroup || !tgtGroup) return;

			const srcIds = new Set(srcGroup.columnIds.map(String));
			const tgtIds = new Set(tgtGroup.columnIds.map(String));
			const reorderedCols = swapGroupBlocks(tableColumns, srcIds, tgtIds);
			const srcIdx = tableGroups.indexOf(srcGroup);
			const tgtIdx = tableGroups.indexOf(tgtGroup);
			const newGroups = [...tableGroups];
			newGroups[srcIdx] = tgtGroup;
			newGroups[tgtIdx] = srcGroup;
			setTableColumns(reorderedCols);
			setTableGroups(newGroups);
			onColumnOrderChange(reorderedCols);
			onColumnGroupOrderChange?.(newGroups, reorderedCols);
		},
		[onColumnGroupOrderChange, onColumnOrderChange, tableColumns, tableGroups],
	);

	const handleGroupDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleGroupDragEnd = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		isDraggingGroup.current = false;
		sourceGroupKey.current = '';
		setDraggingGroupKey('');
	}, []);

	// ── Sort defaults ──────────────────────────────────────────────────────────

	const defaultSortDirection = getSortDirection(defaultSortAsc);
	const defaultSortColumn = React.useMemo(
		() => tableColumns[findColumnIndexById(tableColumns, defaultSortFieldId?.toString())] || {},
		[defaultSortFieldId, tableColumns],
	);

	return {
		tableColumns,
		tableGroups,
		draggingColumnId,
		draggingGroupKey,
		handleDragStart,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDragEnd,
		handleGroupDragStart,
		handleGroupDragEnter,
		handleGroupDragOver,
		handleGroupDragEnd,
		defaultSortDirection,
		defaultSortColumn,
	};
}

export default useColumns;
