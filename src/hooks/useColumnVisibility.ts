import * as React from 'react';
import { TableColumn } from '../types';

export interface ColumnVisibilityEntry<T> {
	column: TableColumn<T>;
	visible: boolean;
}

export interface UseColumnVisibilityResult<T> {
	columns: TableColumn<T>[];
	entries: ColumnVisibilityEntry<T>[];
	toggleColumn: (columnId: string | number) => void;
	isVisible: (columnId: string | number) => boolean;
	showAll: () => void;
	hideAll: () => void;
}

export default function useColumnVisibility<T>(initialColumns: TableColumn<T>[]): UseColumnVisibilityResult<T> {
	const [hiddenIds, setHiddenIds] = React.useState<Set<string | number>>(() => {
		const hidden = new Set<string | number>();
		initialColumns.forEach(col => {
			if (col.omit && col.id != null) hidden.add(col.id);
		});
		return hidden;
	});

	const columns = React.useMemo(
		() => initialColumns.map(col => ({ ...col, omit: col.id != null ? hiddenIds.has(col.id) : col.omit })),
		[initialColumns, hiddenIds],
	);

	const entries = React.useMemo(
		() =>
			initialColumns.map(col => ({
				column: col,
				visible: col.id != null ? !hiddenIds.has(col.id) : !col.omit,
			})),
		[initialColumns, hiddenIds],
	);

	const toggleColumn = React.useCallback((columnId: string | number) => {
		setHiddenIds(prev => {
			const next = new Set(prev);
			if (next.has(columnId)) {
				next.delete(columnId);
			} else {
				next.add(columnId);
			}
			return next;
		});
	}, []);

	const isVisible = React.useCallback((columnId: string | number) => !hiddenIds.has(columnId), [hiddenIds]);

	const showAll = React.useCallback(() => setHiddenIds(new Set()), []);

	const hideAll = React.useCallback(() => {
		setHiddenIds(new Set(initialColumns.map(c => c.id).filter((id): id is string | number => id != null)));
	}, [initialColumns]);

	return { columns, entries, toggleColumn, isVisible, showAll, hideAll };
}
