import * as React from 'react';
import { getPinnedOffsets, getPinnedTotalWidths } from '../util';
import type { PinnedOffsets } from '../util';
import type { TableColumn, ColumnGroup } from '../types';

type Options<T> = {
	tableColumns: TableColumn<T>[];
	tableGroups: ColumnGroup[];
	columnGroups: ColumnGroup[] | undefined;
	columnWidths: Record<string | number, number>;
	selectableRows: boolean;
	expandableRows: boolean;
	expandableRowsHideExpander: boolean;
};

type ColumnPinning<T> = {
	effectiveColumns: TableColumn<T>[];
	pinnedOffsets: PinnedOffsets;
	pinnedTotalWidths: { left: number; right: number };
	hasPinnedColumns: boolean;
};

export default function useColumnPinning<T>({
	tableColumns,
	tableGroups,
	columnGroups,
	columnWidths,
	selectableRows,
	expandableRows,
	expandableRowsHideExpander,
}: Options<T>): ColumnPinning<T> {
	// Pinning is incompatible with CSS-grid group headers — strip it when groups are active
	const hasGroups = tableGroups.length > 0 || (columnGroups != null && columnGroups.length > 0);
	const effectiveColumns = React.useMemo(() => {
		if (!hasGroups) return tableColumns;
		return tableColumns.map(c => {
			if (!c.pinned) return c;
			const { pinned: _p, ...rest } = c;
			return rest as typeof c;
		});
	}, [hasGroups, tableColumns]);

	const warnedPinGroupsRef = React.useRef(false);
	React.useEffect(() => {
		if (!hasGroups || warnedPinGroupsRef.current) return;
		if (tableColumns.some(c => c.pinned)) {
			warnedPinGroupsRef.current = true;
			console.warn(
				'DataTable: column pinning is not supported alongside columnGroups. ' +
					'`pinned` has been stripped from affected columns. ' +
					'Remove `columnGroups` or remove `pinned` from your column definitions to use pinning.',
			);
		}
	}, [hasGroups, tableColumns]);

	const pinnedOffsets = React.useMemo(
		() => getPinnedOffsets(effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander),
		[effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander],
	);

	const pinnedTotalWidths = React.useMemo(
		() =>
			getPinnedTotalWidths(effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander),
		[effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander],
	);

	const hasPinnedColumns = pinnedTotalWidths.left > 0 || pinnedTotalWidths.right > 0;

	return { effectiveColumns, pinnedOffsets, pinnedTotalWidths, hasPinnedColumns };
}
