import { buildGridTemplateColumns, buildGroupHeaderCells } from '../components/dataTableHeadHelpers';
import type { TableColumn } from '../types';

type Row = { id: number };

describe('buildGridTemplateColumns', () => {
	test('prefixColCount adds 48px tracks at the start', () => {
		const result = buildGridTemplateColumns([], 2, {});
		expect(result).toBe('48px 48px');
	});

	test('uses a resized width override when present', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id }];
		expect(buildGridTemplateColumns(cols, 0, { 1: 200 })).toBe('200px');
	});

	test('uses col.width when no resized override and width is set', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id, width: '120px' }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('120px');
	});

	test('uses max-content track when grow=0', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id, grow: 0 }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('minmax(48px, max-content)');
	});

	test('uses max-content track when button=true', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id, button: true }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('minmax(48px, max-content)');
	});

	test('uses minWidth from column for the max-content track', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id, grow: 0, minWidth: '60px' }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('minmax(60px, max-content)');
	});

	test('falls back to fractional track for regular columns', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('minmax(100px, 1fr)');
	});

	test('uses col.grow value in the fractional track', () => {
		const cols: TableColumn<Row>[] = [{ id: 1, name: 'A', selector: r => r.id, grow: 2 }];
		expect(buildGridTemplateColumns(cols, 0, {})).toBe('minmax(100px, 2fr)');
	});

	test('column without id skips the resized width lookup', () => {
		const col: TableColumn<Row> = { name: 'A', selector: r => r.id }; // no id
		expect(buildGridTemplateColumns([col], 0, {})).toBe('minmax(100px, 1fr)');
	});

	test('handles mixed column types', () => {
		const cols: TableColumn<Row>[] = [
			{ id: 1, name: 'A', selector: r => r.id },
			{ id: 2, name: 'B', selector: r => r.id, width: '80px' },
			{ id: 3, name: 'C', selector: r => r.id, grow: 0 },
		];
		expect(buildGridTemplateColumns(cols, 1, { 1: 150 })).toBe('48px 150px 80px minmax(48px, max-content)');
	});
});

describe('buildGroupHeaderCells', () => {
	const col = (id: number): TableColumn<Row> => ({ id, name: String(id), selector: r => r.id });

	test('returns one cell for a grouped column', () => {
		const cols = [col(1), col(2)];
		const groups = [{ name: 'Group A', columnIds: [1, 2] }];
		const cells = buildGroupHeaderCells(cols, groups, new Set(), { 'Group A': 2 }, 0);
		expect(cells).toHaveLength(1);
	});

	test('skips columns listed in ungroupedIds (line 63 branch)', () => {
		const cols = [col(1)];
		const cells = buildGroupHeaderCells(cols, [], new Set(['1']), {}, 0);
		expect(cells).toHaveLength(0);
	});

	test('skips orphan columns not in any group (line 98 branch)', () => {
		// Column 1 is not in ungroupedIds and not in any columnGroup
		const cols = [col(1)];
		const groups = [{ name: 'Group A', columnIds: [99] }];
		const cells = buildGroupHeaderCells(cols, groups, new Set(), { 'Group A': 1 }, 0);
		expect(cells).toHaveLength(0);
	});

	test('falls back to span of 1 when groupColSpans does not include the group', () => {
		const cols = [col(1)];
		const groups = [{ name: 'Group A', columnIds: [1] }];
		// Pass empty groupColSpans — triggers the ?? 1 fallback
		const cells = buildGroupHeaderCells(cols, groups, new Set(), {}, 0);
		expect(cells).toHaveLength(1);
	});
});
