import * as React from 'react';
import type { TableColumn } from '../types';
import { getProperty } from '../util';

export type ExportFormat = 'csv' | 'json';

export interface UseTableExportOptions<T> {
	/** Columns to include in the export. Columns with `omit: true` are skipped automatically. */
	columns: TableColumn<T>[];
	/** Rows to export. Pass `filteredSortedData` (from `useTableData` + `useColumnFilter`) for "current view" semantics. */
	rows: T[];
	/**
	 * How to extract the value for each cell.
	 * - `'selector'` (default): runs `column.selector` and stringifies the result. Ignores `format` and custom `cell` renderers.
	 * - `'format'`: prefers `column.format`, falling back to `selector`. Use this when your formatted values are what users see.
	 */
	valueSource?: 'selector' | 'format';
	/** Override the header label for a given column id. Useful when `column.name` is a React node. */
	headerOverrides?: Record<string | number, string>;
	/** Restrict the export to these column ids, in this order. Omit to include all non-omitted columns. */
	columnOrder?: (string | number)[];
}

export interface UseTableExportResult {
	/** Generate a CSV string from the current rows and columns. */
	toCSV: () => string;
	/** Generate a JSON string (pretty-printed, 2-space indent). */
	toJSON: () => string;
	/** Trigger a browser download. No-op on server. */
	download: (filename: string, format?: ExportFormat) => void;
	/** Copy CSV to the clipboard. Returns a promise that resolves on success. */
	copy: (format?: ExportFormat) => Promise<void>;
}

function escapeCsvCell(value: string): string {
	if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

function headerLabel<T>(col: TableColumn<T>, overrides?: Record<string | number, string>): string {
	if (col.id != null && overrides && overrides[col.id] !== undefined) return overrides[col.id];
	if (typeof col.name === 'string' || typeof col.name === 'number') return String(col.name);
	return col.id != null ? String(col.id) : '';
}

function cellToString(value: unknown): string {
	if (value == null) return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	// React nodes or arbitrary objects shouldn't end up in exports — coerce to JSON for safety.
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

/**
 * Headless export hook — produces CSV/JSON for the rows you pass in.
 *
 * Pair with `useColumnFilter` + `useTableData` (or the values DataTable already exposes
 * via callbacks) to export the user's current view rather than the raw data set.
 */
export default function useTableExport<T>(options: UseTableExportOptions<T>): UseTableExportResult {
	const { columns, rows, valueSource = 'selector', headerOverrides, columnOrder } = options;

	const exportColumns = React.useMemo(() => {
		const visible = columns.filter(c => !c.omit);
		if (!columnOrder) return visible;
		const byId = new Map<string | number, TableColumn<T>>();
		visible.forEach(c => {
			if (c.id != null) byId.set(c.id, c);
		});
		return columnOrder.map(id => byId.get(id)).filter((c): c is TableColumn<T> => !!c);
	}, [columns, columnOrder]);

	const buildRows = React.useCallback((): string[][] => {
		return rows.map((row, rowIndex) =>
			exportColumns.map(col => {
				if (valueSource === 'format' && col.format) {
					const node = col.format(row, rowIndex);
					return cellToString(node);
				}
				const raw = getProperty(row, col.selector, undefined, rowIndex);
				return cellToString(raw);
			}),
		);
	}, [rows, exportColumns, valueSource]);

	const toCSV = React.useCallback((): string => {
		const header = exportColumns.map(c => escapeCsvCell(headerLabel(c, headerOverrides))).join(',');
		const body = buildRows()
			.map(cells => cells.map(escapeCsvCell).join(','))
			.join('\n');
		return body ? `${header}\n${body}` : header;
	}, [exportColumns, headerOverrides, buildRows]);

	const toJSON = React.useCallback((): string => {
		const headers = exportColumns.map(c => headerLabel(c, headerOverrides));
		const objects = buildRows().map(cells => {
			const obj: Record<string, string> = {};
			cells.forEach((v, i) => {
				obj[headers[i] ?? `col_${i}`] = v;
			});
			return obj;
		});
		return JSON.stringify(objects, null, 2);
	}, [exportColumns, headerOverrides, buildRows]);

	const download = React.useCallback(
		(filename: string, format: ExportFormat = 'csv') => {
			if (typeof document === 'undefined') return;
			const content = format === 'json' ? toJSON() : toCSV();
			const mime = format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8';
			const blob = new Blob([content], { type: mime });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		},
		[toCSV, toJSON],
	);

	const copy = React.useCallback(
		async (format: ExportFormat = 'csv') => {
			if (typeof navigator === 'undefined' || !navigator.clipboard) {
				throw new Error('Clipboard API is not available in this environment.');
			}
			const content = format === 'json' ? toJSON() : toCSV();
			await navigator.clipboard.writeText(content);
		},
		[toCSV, toJSON],
	);

	return { toCSV, toJSON, download, copy };
}
