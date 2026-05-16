import { renderHook, act } from '@testing-library/react';
import useColumnVisibility from '../hooks/useColumnVisibility';
import type { TableColumn } from '../types';

type Row = { id: number; name: string };

const col1: TableColumn<Row> = { id: 'a', name: 'A', selector: r => r.name };
const col2: TableColumn<Row> = { id: 'b', name: 'B', selector: r => r.id };
const col3: TableColumn<Row> = { id: 'c', name: 'C', selector: r => r.name, omit: true };

describe('useColumnVisibility:initial state', () => {
	test('all columns start visible when none have omit=true', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		expect(result.current.columns.every(c => !c.omit)).toBe(true);
		expect(result.current.entries.every(e => e.visible)).toBe(true);
	});

	test('a column with omit=true starts hidden', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		expect(result.current.isVisible('c')).toBe(false);
		const entry = result.current.entries.find(e => e.column.id === 'c');
		expect(entry?.visible).toBe(false);
	});

	test('columns array reflects the initial omit state', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		const produced = result.current.columns;
		expect(produced.find(c => c.id === 'c')?.omit).toBe(true);
		expect(produced.find(c => c.id === 'a')?.omit).toBe(false);
	});
});

describe('useColumnVisibility:toggleColumn', () => {
	test('hides a visible column', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		act(() => result.current.toggleColumn('a'));

		expect(result.current.isVisible('a')).toBe(false);
		expect(result.current.columns.find(c => c.id === 'a')?.omit).toBe(true);
	});

	test('shows a hidden column', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		act(() => result.current.toggleColumn('c'));

		expect(result.current.isVisible('c')).toBe(true);
		expect(result.current.columns.find(c => c.id === 'c')?.omit).toBe(false);
	});

	test('toggling twice restores the original visibility', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		act(() => result.current.toggleColumn('b'));
		act(() => result.current.toggleColumn('b'));

		expect(result.current.isVisible('b')).toBe(true);
	});

	test('toggling one column does not affect others', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		act(() => result.current.toggleColumn('a'));

		expect(result.current.isVisible('b')).toBe(true);
	});
});

describe('useColumnVisibility:showAll / hideAll', () => {
	test('showAll makes every column visible', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		act(() => result.current.showAll());

		expect(result.current.entries.every(e => e.visible)).toBe(true);
		expect(result.current.columns.every(c => !c.omit)).toBe(true);
	});

	test('hideAll makes every column with an id hidden', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		act(() => result.current.hideAll());

		expect(result.current.isVisible('a')).toBe(false);
		expect(result.current.isVisible('b')).toBe(false);
		expect(result.current.columns.every(c => c.omit)).toBe(true);
	});

	test('showAll after hideAll reveals all columns again', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		act(() => result.current.hideAll());
		act(() => result.current.showAll());

		expect(result.current.entries.every(e => e.visible)).toBe(true);
	});
});

describe('useColumnVisibility:entries shape', () => {
	test('entries contain the original column object and its visibility', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2]));

		const entry = result.current.entries[0];
		expect(entry.column).toBe(col1);
		expect(entry.visible).toBe(true);
	});

	test('entries length matches the number of input columns', () => {
		const { result } = renderHook(() => useColumnVisibility([col1, col2, col3]));

		expect(result.current.entries).toHaveLength(3);
	});
});

describe('useColumnVisibility:columns without an id', () => {
	test('a column without an id is not manageable — visibility falls through to its omit prop', () => {
		const noIdCol: TableColumn<Row> = { name: 'No ID', selector: r => r.name, omit: true };
		const { result } = renderHook(() => useColumnVisibility([noIdCol]));

		// Cannot be toggled by id, so omit stays as-is from the prop
		expect(result.current.columns[0].omit).toBe(true);
		expect(result.current.entries[0].visible).toBe(false);
	});
});
