import { renderHook, act } from '@testing-library/react';
import useColumns, { swapGroupBlocks } from '../hooks/useColumns';
import { SortOrder } from '../types';
import type { TableColumn, ColumnGroup } from '../types';

type Row = { id: number; name: string };

const col1: TableColumn<Row> = { id: 1, name: 'Name', selector: r => r.name };
const col2: TableColumn<Row> = { id: 2, name: 'Id', selector: r => r.id };
const col3: TableColumn<Row> = { id: 3, name: 'Extra', selector: r => r.id };

const noop = () => {};

function makeHook(
	columns: TableColumn<Row>[],
	opts: {
		defaultSortFieldId?: string | number | null;
		defaultSortAsc?: boolean;
		columnGroups?: ColumnGroup[];
		onColumnOrderChange?: (cols: TableColumn<Row>[]) => void;
		onColumnGroupOrderChange?: (groups: ColumnGroup[], cols: TableColumn<Row>[]) => void;
	} = {},
) {
	return renderHook(() =>
		useColumns<Row>(
			columns,
			opts.onColumnOrderChange ?? noop,
			opts.onColumnGroupOrderChange,
			opts.columnGroups,
			opts.defaultSortFieldId ?? null,
			opts.defaultSortAsc ?? true,
		),
	);
}

// ── defaultSort ───────────────────────────────────────────────────────────────

describe('useColumns:defaultSortColumn', () => {
	test('returns the column matching defaultSortFieldId', () => {
		const { result } = makeHook([col1, col2], { defaultSortFieldId: 2 });

		expect(result.current.defaultSortColumn.id).toBe(2);
	});

	test('returns an empty object when no defaultSortFieldId is given', () => {
		const { result } = makeHook([col1, col2]);

		expect(result.current.defaultSortColumn).toEqual({});
	});
});

describe('useColumns:defaultSortDirection', () => {
	test('returns ASC when defaultSortAsc=true', () => {
		const { result } = makeHook([col1], { defaultSortAsc: true });

		expect(result.current.defaultSortDirection).toBe(SortOrder.ASC);
	});

	test('returns DESC when defaultSortAsc=false', () => {
		const { result } = makeHook([col1], { defaultSortAsc: false });

		expect(result.current.defaultSortDirection).toBe(SortOrder.DESC);
	});
});

// ── tableColumns decoration ───────────────────────────────────────────────────

describe('useColumns:tableColumns', () => {
	test('decorates columns with sequential ids when none are provided', () => {
		const raw: TableColumn<Row>[] = [
			{ name: 'A', selector: r => r.name },
			{ name: 'B', selector: r => r.id },
		];
		const { result } = makeHook(raw);

		expect(result.current.tableColumns[0].id).toBe(1);
		expect(result.current.tableColumns[1].id).toBe(2);
	});

	test('re-decorates when the columns prop changes', () => {
		const { result, rerender } = renderHook(
			({ cols }: { cols: TableColumn<Row>[] }) => useColumns<Row>(cols, noop, undefined, undefined, null, true),
			{ initialProps: { cols: [col1, col2] } },
		);

		expect(result.current.tableColumns).toHaveLength(2);

		rerender({ cols: [col1, col2, col3] });
		expect(result.current.tableColumns).toHaveLength(3);
	});
});

// ── tableGroups ───────────────────────────────────────────────────────────────

describe('useColumns:tableGroups', () => {
	test('initialises with the provided columnGroups', () => {
		const groups: ColumnGroup[] = [{ name: 'Info', columnIds: [1, 2] }];
		const { result } = makeHook([col1, col2], { columnGroups: groups });

		expect(result.current.tableGroups).toEqual(groups);
	});

	test('initialises to an empty array when no columnGroups are provided', () => {
		const { result } = makeHook([col1, col2]);

		expect(result.current.tableGroups).toEqual([]);
	});

	test('updates when columnGroups prop changes', () => {
		const fixedCols = [col1, col2]; // stable reference — avoid triggering columns effect on every render
		const { result, rerender } = renderHook(
			(props: { groups?: ColumnGroup[] }) => useColumns<Row>(fixedCols, noop, undefined, props.groups, null, true),
			{ initialProps: { groups: undefined } as { groups?: ColumnGroup[] } },
		);

		expect(result.current.tableGroups).toEqual([]);

		const newGroups: ColumnGroup[] = [{ name: 'Group A', columnIds: [1] }];
		rerender({ groups: newGroups });

		expect(result.current.tableGroups).toEqual(newGroups);
	});
});

// ── swapGroupBlocks ───────────────────────────────────────────────────────────

describe('swapGroupBlocks', () => {
	const c = (id: number): TableColumn<Row> => ({ id, name: String(id), selector: r => r.id });

	test('swaps two adjacent group blocks', () => {
		// [A, B, C, D] where A,B=group1 and C,D=group2 → [C, D, A, B]
		const cols = [c(1), c(2), c(3), c(4)];
		const result = swapGroupBlocks(cols, new Set(['1', '2']), new Set(['3', '4']));
		expect(result.map(x => x.id)).toEqual([3, 4, 1, 2]);
	});

	test('preserves ungrouped columns between the two groups', () => {
		// [A, X, B] where A=group1, B=group2, X is ungrouped → [B, X, A]
		const cols = [c(1), c(99), c(2)];
		const result = swapGroupBlocks(cols, new Set(['1']), new Set(['2']));
		expect(result.map(x => x.id)).toEqual([2, 99, 1]);
	});
});

// ── column drag-and-drop ──────────────────────────────────────────────────────

function makeDragEvent(attrs: Record<string, string> = {}): React.DragEvent<HTMLDivElement> {
	const el = document.createElement('div');
	Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));

	const event = new Event('dragstart', { bubbles: true }) as unknown as React.DragEvent<HTMLDivElement>;
	Object.defineProperty(event, 'target', { value: el });
	Object.defineProperty(event, 'currentTarget', { value: el });
	Object.defineProperty(event, 'relatedTarget', { value: null });
	Object.defineProperty(event, 'preventDefault', { value: () => undefined });
	return event;
}

describe('useColumns:column drag handlers', () => {
	test('handleDragStart sets draggingColumnId', () => {
		const { result } = makeHook([col1, col2]);

		act(() => {
			result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' }));
		});

		expect(result.current.draggingColumnId).toBe('1');
	});

	test('handleDragEnd clears draggingColumnId', () => {
		const { result } = makeHook([col1, col2]);

		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));
		act(() => result.current.handleDragEnd(makeDragEvent()));

		expect(result.current.draggingColumnId).toBe('');
	});

	test('handleDragEnter reorders columns and fires onColumnOrderChange', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		// Start dragging col1
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));

		// Enter col2
		const enterEl = document.createElement('div');
		enterEl.setAttribute('data-column-id', '2');
		const enterEvent = new Event('dragenter', { bubbles: true }) as unknown as React.DragEvent<HTMLDivElement>;
		Object.defineProperty(enterEvent, 'currentTarget', { value: enterEl });
		Object.defineProperty(enterEvent, 'relatedTarget', { value: null });
		Object.defineProperty(enterEvent, 'preventDefault', { value: () => undefined });

		act(() => result.current.handleDragEnter(enterEvent));

		expect(onOrderChange).toHaveBeenCalled();
		// col2 should now be at index 0
		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		expect(newOrder[0].id).toBe(2);
		expect(newOrder[1].id).toBe(1);
	});

	test('handleDragStart ignores elements with no data-column-id', () => {
		const { result } = makeHook([col1, col2]);

		act(() => result.current.handleDragStart(makeDragEvent())); // no attribute

		expect(result.current.draggingColumnId).toBe('');
	});

	test('handleDragEnter does nothing when entering the column being dragged', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));

		const el = document.createElement('div');
		el.setAttribute('data-column-id', '1'); // same column
		const ev = new Event('dragenter') as unknown as React.DragEvent<HTMLDivElement>;
		Object.defineProperty(ev, 'currentTarget', { value: el });
		Object.defineProperty(ev, 'relatedTarget', { value: null });
		Object.defineProperty(ev, 'preventDefault', { value: () => undefined });

		act(() => result.current.handleDragEnter(ev));

		expect(onOrderChange).not.toHaveBeenCalled();
	});

	test('handleDragEnter ignores child-bubble events', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));

		const el = document.createElement('div');
		el.setAttribute('data-column-id', '2');
		const child = document.createElement('span');
		el.appendChild(child); // child is inside el, so el.contains(child) === true

		const ev = new Event('dragenter') as unknown as React.DragEvent<HTMLDivElement>;
		Object.defineProperty(ev, 'currentTarget', { value: el });
		Object.defineProperty(ev, 'relatedTarget', { value: child });
		Object.defineProperty(ev, 'preventDefault', { value: () => undefined });

		act(() => result.current.handleDragEnter(ev));

		expect(onOrderChange).not.toHaveBeenCalled();
	});

	test('handleDragEnter blocks cross-group reorder', () => {
		const onOrderChange = vi.fn();
		const groups: ColumnGroup[] = [
			{ name: 'G1', columnIds: [1] },
			{ name: 'G2', columnIds: [2] },
		];
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange, columnGroups: groups });

		// Drag col1 (group G1) → try to enter col2 (group G2)
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));

		const el = document.createElement('div');
		el.setAttribute('data-column-id', '2');
		const ev = new Event('dragenter') as unknown as React.DragEvent<HTMLDivElement>;
		Object.defineProperty(ev, 'currentTarget', { value: el });
		Object.defineProperty(ev, 'relatedTarget', { value: null });
		Object.defineProperty(ev, 'preventDefault', { value: () => undefined });

		act(() => result.current.handleDragEnter(ev));

		expect(onOrderChange).not.toHaveBeenCalled();
	});

	test('handleDragOver and handleDragLeave call preventDefault', () => {
		const { result } = makeHook([col1, col2]);
		const prevented: string[] = [];
		const ev = { preventDefault: () => prevented.push('prevented') } as unknown as React.DragEvent<HTMLDivElement>;

		act(() => result.current.handleDragOver(ev));
		act(() => result.current.handleDragLeave(ev));

		expect(prevented).toHaveLength(2);
	});
});

// ── pin normalisation on drag ─────────────────────────────────────────────────

function makeDragEnterEvent(targetId: string): React.DragEvent<HTMLDivElement> {
	const el = document.createElement('div');
	el.setAttribute('data-column-id', targetId);
	const ev = new Event('dragenter') as unknown as React.DragEvent<HTMLDivElement>;
	Object.defineProperty(ev, 'currentTarget', { value: el });
	Object.defineProperty(ev, 'relatedTarget', { value: null });
	Object.defineProperty(ev, 'preventDefault', { value: () => undefined });
	return ev;
}

describe('useColumns:pin normalisation on drag', () => {
	test('dragging a non-pinned column into left-pin zone pins it', () => {
		const onOrderChange = vi.fn();
		const leftPin: TableColumn<Row> = { id: 1, name: 'Name', selector: r => r.name, pinned: 'left' };
		const unpinned: TableColumn<Row> = { id: 2, name: 'Id', selector: r => r.id };
		const { result } = makeHook([leftPin, unpinned], { onColumnOrderChange: onOrderChange });

		// Drag unpinned (id=2) into the left-pinned column (id=1) position
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '2' })));
		act(() => result.current.handleDragEnter(makeDragEnterEvent('1')));

		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		// col2 inserted at index 0 → normalizePins has 1 left slot → col2 becomes left-pinned
		expect(newOrder[0].id).toBe(2);
		expect(newOrder[0].pinned).toBe('left');
		// col1 slides to index 1 → beyond the 1 left-pin zone → unpinned
		expect(newOrder[1].id).toBe(1);
		expect(newOrder[1].pinned).toBeUndefined();
	});

	test('dragging a left-pinned column out of pin zone unpins it', () => {
		const onOrderChange = vi.fn();
		const leftPin: TableColumn<Row> = { id: 1, name: 'Name', selector: r => r.name, pinned: 'left' };
		const a: TableColumn<Row> = { id: 2, name: 'A', selector: r => r.id };
		const b: TableColumn<Row> = { id: 3, name: 'B', selector: r => r.id };
		const { result } = makeHook([leftPin, a, b], { onColumnOrderChange: onOrderChange });

		// Drag the left-pinned col (id=1) to the last position (id=3)
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));
		act(() => result.current.handleDragEnter(makeDragEnterEvent('3')));

		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		// col1 is now at index 2 — beyond the 1 left-pin zone → unpinned
		expect(newOrder[2].id).toBe(1);
		expect(newOrder[2].pinned).toBeUndefined();
	});

	test('dragging a right-pinned column all the way left joins the left-pin group', () => {
		const onOrderChange = vi.fn();
		const leftPin: TableColumn<Row> = { id: 1, name: 'L', selector: r => r.name, pinned: 'left' };
		const mid: TableColumn<Row> = { id: 2, name: 'M', selector: r => r.id };
		const rightPin: TableColumn<Row> = { id: 3, name: 'R', selector: r => r.id, pinned: 'right' };
		const { result } = makeHook([leftPin, mid, rightPin], { onColumnOrderChange: onOrderChange });

		// Drag right-pinned (id=3) into position of left-pinned (id=1)
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '3' })));
		act(() => result.current.handleDragEnter(makeDragEnterEvent('1')));

		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		// col3 inserted at index 0 → becomes left-pinned (1 left slot)
		expect(newOrder[0].id).toBe(3);
		expect(newOrder[0].pinned).toBe('left');
		// col1 at index 1 → beyond left zone → unpinned
		expect(newOrder[1].id).toBe(1);
		expect(newOrder[1].pinned).toBeUndefined();
		// col2 is now at last position; normalizePins still sees 1 right-pin slot → col2 inherits right-pin
		expect(newOrder[2].pinned).toBe('right');
	});

	test('drag uses move-insert not swap (source column ends up AT target position)', () => {
		const onOrderChange = vi.fn();
		const a: TableColumn<Row> = { id: 1, name: 'A', selector: r => r.name };
		const b: TableColumn<Row> = { id: 2, name: 'B', selector: r => r.id };
		const c: TableColumn<Row> = { id: 3, name: 'C', selector: r => r.id };
		const { result } = makeHook([a, b, c], { onColumnOrderChange: onOrderChange });

		// Drag A (index 0) to C (index 2) → result should be [B, C, A]
		act(() => result.current.handleDragStart(makeDragEvent({ 'data-column-id': '1' })));
		act(() => result.current.handleDragEnter(makeDragEnterEvent('3')));

		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		expect(newOrder.map(x => x.id)).toEqual([2, 3, 1]);
	});
});

// ── pointer (touch/pen) reorder ───────────────────────────────────────────────

function makePointerDown(
	attr: { key: string; value: string },
	pointerType: 'touch' | 'pen' | 'mouse' = 'touch',
): React.PointerEvent<HTMLDivElement> {
	const el = document.createElement('div');
	el.setAttribute(attr.key, attr.value);
	const ev = new Event('pointerdown') as unknown as React.PointerEvent<HTMLDivElement>;
	Object.defineProperty(ev, 'currentTarget', { value: el });
	Object.defineProperty(ev, 'pointerId', { value: 1 });
	Object.defineProperty(ev, 'pointerType', { value: pointerType });
	return ev;
}

function firePointerMove(clientX: number) {
	document.dispatchEvent(Object.assign(new Event('pointermove'), { pointerId: 1, clientX, clientY: 0 }));
}

describe('useColumns:pointer reorder', () => {
	const originalEfp = document.elementFromPoint;
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
		document.elementFromPoint = originalEfp;
	});

	function stubElementUnderPoint(attr: string, value: string) {
		const el = document.createElement('div');
		el.setAttribute(attr, value);
		// jsdom does not implement elementFromPoint, so define it rather than spy.
		document.elementFromPoint = () => el;
	}

	test('long-press + move reorders a column and fires onColumnOrderChange', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		act(() => result.current.handlePointerDown(makePointerDown({ key: 'data-column-id', value: '1' })));
		// Long-press elapses → column grabbed
		act(() => vi.advanceTimersByTime(250));
		expect(result.current.draggingColumnId).toBe('1');

		stubElementUnderPoint('data-column-id', '2');
		act(() => firePointerMove(500));

		expect(onOrderChange).toHaveBeenCalled();
		const newOrder = onOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		expect(newOrder.map(x => x.id)).toEqual([2, 1]);
	});

	test('does not reorder before the long-press elapses', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		act(() => result.current.handlePointerDown(makePointerDown({ key: 'data-column-id', value: '1' })));
		// Move before the timer fires — a plain scroll, not a grab
		stubElementUnderPoint('data-column-id', '2');
		act(() => firePointerMove(500));

		expect(onOrderChange).not.toHaveBeenCalled();
		expect(result.current.draggingColumnId).toBe('');
	});

	test('ignores mouse pointers (native DnD handles those)', () => {
		const onOrderChange = vi.fn();
		const { result } = makeHook([col1, col2], { onColumnOrderChange: onOrderChange });

		act(() => result.current.handlePointerDown(makePointerDown({ key: 'data-column-id', value: '1' }, 'mouse')));
		act(() => vi.advanceTimersByTime(250));

		expect(result.current.draggingColumnId).toBe('');
	});

	test('pointerup clears the dragging state', () => {
		const { result } = makeHook([col1, col2]);

		act(() => result.current.handlePointerDown(makePointerDown({ key: 'data-column-id', value: '1' })));
		act(() => vi.advanceTimersByTime(250));
		expect(result.current.draggingColumnId).toBe('1');

		act(() => {
			document.dispatchEvent(Object.assign(new Event('pointerup'), { pointerId: 1 }));
		});
		expect(result.current.draggingColumnId).toBe('');
	});

	test('long-press + move swaps groups and fires order changes', () => {
		const onOrderChange = vi.fn();
		const onGroupOrderChange = vi.fn();
		const groups: ColumnGroup[] = [
			{ name: 'G1', columnIds: [1] },
			{ name: 'G2', columnIds: [2] },
		];
		const { result } = makeHook([col1, col2], {
			onColumnOrderChange: onOrderChange,
			onColumnGroupOrderChange: onGroupOrderChange,
			columnGroups: groups,
		});

		act(() => result.current.handleGroupPointerDown(makePointerDown({ key: 'data-group-key', value: '1' })));
		act(() => vi.advanceTimersByTime(250));
		expect(result.current.draggingGroupKey).toBe('1');

		stubElementUnderPoint('data-group-key', '2');
		act(() => firePointerMove(500));

		expect(onOrderChange).toHaveBeenCalled();
		expect(onGroupOrderChange).toHaveBeenCalled();
	});
});
