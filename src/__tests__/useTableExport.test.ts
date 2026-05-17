import { renderHook } from '@testing-library/react';
import useTableExport from '../hooks/useTableExport';
import type { TableColumn } from '../types';

type Row = { id: number; name: string; salary: number; note?: string; hidden?: string };

const columns: TableColumn<Row>[] = [
	{ id: 'id', name: 'ID', selector: r => r.id },
	{ id: 'name', name: 'Name', selector: r => r.name },
	{ id: 'salary', name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}` },
	{ id: 'hidden', name: 'Hidden', selector: r => r.hidden, omit: true },
];

const rows: Row[] = [
	{ id: 1, name: 'Alice', salary: 80000 },
	{ id: 2, name: 'Bob, Jr.', salary: 95000 },
	{ id: 3, name: 'Carol "C" King', salary: 100000, note: 'line1\nline2' },
];

describe('useTableExport: CSV', () => {
	test('emits a header row of column names', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows: [] }));
		expect(result.current.toCSV()).toBe('ID,Name,Salary');
	});

	test('emits rows with selector values by default (raw, not formatted)', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows }));
		const csv = result.current.toCSV();
		const lines = csv.split('\n');
		expect(lines[0]).toBe('ID,Name,Salary');
		expect(lines[1]).toBe('1,Alice,80000');
	});

	test('escapes commas, quotes, and newlines in cell values', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows }));
		const csv = result.current.toCSV();
		const lines = csv.split('\n');
		expect(lines[2]).toContain('"Bob, Jr."');
		expect(lines[3]).toContain('"Carol ""C"" King"');
	});

	test('skips columns with omit:true', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows }));
		expect(result.current.toCSV()).not.toContain('Hidden');
	});

	test('valueSource:"format" prefers column.format', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows, valueSource: 'format' }));
		const lines = result.current.toCSV().split('\n');
		expect(lines[1]).toContain('"$80,000"');
	});

	test('headerOverrides replace the rendered header label', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows: [], headerOverrides: { name: 'Full Name' } }));
		expect(result.current.toCSV()).toBe('ID,Full Name,Salary');
	});

	test('columnOrder restricts and reorders columns', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows, columnOrder: ['name', 'id'] }));
		const lines = result.current.toCSV().split('\n');
		expect(lines[0]).toBe('Name,ID');
		expect(lines[1]).toBe('Alice,1');
	});
});

describe('useTableExport: JSON', () => {
	test('emits an array of objects keyed by header label', () => {
		const { result } = renderHook(() => useTableExport({ columns, rows: rows.slice(0, 1) }));
		const parsed = JSON.parse(result.current.toJSON());
		expect(parsed).toEqual([{ ID: '1', Name: 'Alice', Salary: '80000' }]);
	});
});

describe('useTableExport: download', () => {
	test('triggers an anchor click with a blob URL for CSV', () => {
		const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
		const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const clickSpy = vi.fn();
		const origCreate = document.createElement.bind(document);
		vi.spyOn(document, 'createElement').mockImplementation(tag => {
			const el = origCreate(tag);
			if (tag === 'a') (el as HTMLAnchorElement).click = clickSpy;
			return el;
		});

		const { result } = renderHook(() => useTableExport({ columns, rows: rows.slice(0, 1) }));
		result.current.download('out.csv');

		expect(createSpy).toHaveBeenCalledOnce();
		expect(clickSpy).toHaveBeenCalledOnce();
		expect(revokeSpy).toHaveBeenCalledWith('blob:fake');

		vi.restoreAllMocks();
	});

	test('uses application/json mime when format is "json"', () => {
		const blobs: Blob[] = [];
		const origBlob = globalThis.Blob;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(globalThis as any).Blob = class extends origBlob {
			constructor(parts: BlobPart[], options?: BlobPropertyBag) {
				super(parts, options);
				blobs.push(this);
			}
		};
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

		const { result } = renderHook(() => useTableExport({ columns, rows: [] }));
		result.current.download('out.json', 'json');

		expect(blobs[0].type).toContain('application/json');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(globalThis as any).Blob = origBlob;
		vi.restoreAllMocks();
	});
});

describe('useTableExport: copy', () => {
	test('writes CSV to navigator.clipboard', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText },
		});

		const { result } = renderHook(() => useTableExport({ columns, rows: rows.slice(0, 1) }));
		await result.current.copy('csv');

		expect(writeText).toHaveBeenCalledOnce();
		expect(writeText.mock.calls[0][0]).toContain('Alice');
	});

	test('writes JSON when format is "json"', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText },
		});

		const { result } = renderHook(() => useTableExport({ columns, rows: rows.slice(0, 1) }));
		await result.current.copy('json');

		expect(writeText.mock.calls[0][0]).toContain('"Name": "Alice"');
	});

	test('rejects when clipboard API is unavailable', async () => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
		const { result } = renderHook(() => useTableExport({ columns, rows: [] }));
		await expect(result.current.copy()).rejects.toThrow(/Clipboard API/);
	});
});
