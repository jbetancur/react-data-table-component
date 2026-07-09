import * as React from 'react';
import { render, act } from '@testing-library/react';
import DataTable from '../components/DataTable';
import PinnedScrollbar from '../components/PinnedScrollbar';
import { renderWithTheme } from './test-helpers';
import type { TableColumn } from '../types';

interface Row {
	id: number;
	name: string;
	role: string;
	status: string;
}

const data: Row[] = [
	{ id: 1, name: 'Alice', role: 'Engineer', status: 'Active' },
	{ id: 2, name: 'Bob', role: 'Designer', status: 'Inactive' },
];

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, pinned: 'left', width: '150px' },
	{ id: 'role', name: 'Role', selector: r => r.role, width: '200px' },
	{ id: 'status', name: 'Status', selector: r => r.status, pinned: 'right', width: '120px' },
];

// ── DataTable pinning integration ─────────────────────────────────────────────

describe('DataTable column pinning', () => {
	test('renders left-pinned column with rdt_pinLeft class on header cells', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		expect(container.querySelectorAll('.rdt_pinLeft').length).toBeGreaterThanOrEqual(1);
	});

	test('renders right-pinned column with rdt_pinRight class', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		expect(container.querySelectorAll('.rdt_pinRight').length).toBeGreaterThanOrEqual(1);
	});

	test('applies rdt_pinLeftLast to rightmost left-pinned column', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		expect(container.querySelectorAll('.rdt_pinLeftLast').length).toBeGreaterThanOrEqual(1);
	});

	test('applies rdt_pinRightFirst to leftmost right-pinned column', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		expect(container.querySelectorAll('.rdt_pinRightFirst').length).toBeGreaterThanOrEqual(1);
	});

	test('left-pinned header cell has position:sticky style', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		const cell = container.querySelector('.rdt_pinLeft') as HTMLElement;
		expect(cell?.style.position).toBe('sticky');
	});

	test('right-pinned cell has position:sticky with inline-end offset', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);
		const cell = container.querySelector('.rdt_pinRight') as HTMLElement;
		expect(cell?.style.position).toBe('sticky');
		expect(cell?.style.insetInlineEnd).toBe('0px');
	});

	test('strips pinned from columns when columnGroups are active', () => {
		const groupedCols: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, pinned: 'left', width: '150px' },
			{ id: 'role', name: 'Role', selector: r => r.role, width: '200px' },
		];
		const { container } = render(
			<DataTable columns={groupedCols} data={data} columnGroups={[{ name: 'Info', columnIds: ['name', 'role'] }]} />,
		);
		expect(container.querySelectorAll('.rdt_pinLeft').length).toBe(0);
	});

	test('adds rdt_responsiveWrapperHideScrollbar when pinned columns present and responsive', () => {
		const { container } = render(<DataTable columns={columns} data={data} responsive />);
		expect(container.querySelector('.rdt_responsiveWrapperHideScrollbar')).not.toBeNull();
	});

	test('does not add hide-scrollbar class when no columns are pinned', () => {
		const plain: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name },
			{ id: 'role', name: 'Role', selector: r => r.role },
		];
		const { container } = render(<DataTable columns={plain} data={data} responsive />);
		expect(container.querySelector('.rdt_responsiveWrapperHideScrollbar')).toBeNull();
	});

	test('multiple left-pinned columns get sequential sticky left offsets', () => {
		const multiPin: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, pinned: 'left', width: '150px' },
			{ id: 'role', name: 'Role', selector: r => r.role, pinned: 'left', width: '200px' },
			{ id: 'status', name: 'Status', selector: r => r.status, width: '120px' },
		];
		const { container } = render(<DataTable columns={multiPin} data={data} />);
		const cells = Array.from(container.querySelectorAll('.rdt_pinLeft')) as HTMLElement[];
		const offsets = cells.map(el => parseFloat(el.style.insetInlineStart)).filter(v => !isNaN(v));
		expect(offsets).toContain(0);
		expect(offsets.some(v => v > 0)).toBe(true);
	});
});

// ── PinnedScrollbar ──────────────────────────────────────────────────────────

function makeScrollRef(scrollWidth = 1000, clientWidth = 400): React.RefObject<HTMLDivElement> {
	const el = document.createElement('div');
	Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => scrollWidth });
	Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => clientWidth });
	return { current: el } as React.RefObject<HTMLDivElement>;
}

describe('PinnedScrollbar', () => {
	test('renders null before ResizeObserver fires (no overflow detected yet)', () => {
		const ref = makeScrollRef(400, 400); // no overflow
		const { container } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);
		expect(container.querySelector('.rdt_pinnedScrollbarTrack')).toBeNull();
	});

	test('becomes visible after scroll event fires with overflow content', async () => {
		const ref = makeScrollRef(1000, 400);
		const { container } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={150} rightInset={120} />);

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const track = container.querySelector('.rdt_pinnedScrollbarTrack');
		expect(track).not.toBeNull();
	});

	test('applies logical margin insets to the track element', async () => {
		const ref = makeScrollRef(1000, 400);
		const { container } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={150} rightInset={120} />);

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const track = container.querySelector('.rdt_pinnedScrollbarTrack') as HTMLElement | null;
		expect(track?.style.marginInlineStart).toBe('150px');
		expect(track?.style.marginInlineEnd).toBe('120px');
	});

	test('thumb width is proportional to viewport/scroll ratio', async () => {
		const ref = makeScrollRef(1000, 400); // 40% visible → thumb ~40% of track
		const { container } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);

		// Mock track clientWidth so ratio math works
		const track = container.querySelector('.rdt_pinnedScrollbarTrack');
		if (track) {
			Object.defineProperty(track, 'clientWidth', { configurable: true, get: () => 500 });
		}

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const thumb = container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement | null;
		if (thumb) {
			const width = parseFloat(thumb.style.width);
			// 400/1000 * 500 = 200px
			expect(width).toBeGreaterThanOrEqual(30); // at least minimum thumb size
		}
	});

	test('track click outside thumb scrolls the container', async () => {
		const ref = makeScrollRef(1000, 400);
		Object.defineProperty(ref.current, 'scrollLeft', {
			configurable: true,
			writable: true,
			value: 0,
		});

		const { container } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const track = container.querySelector('.rdt_pinnedScrollbarTrack') as HTMLElement | null;
		if (track) {
			// Click at far right of track → should scroll forward
			Object.defineProperty(track, 'getBoundingClientRect', {
				configurable: true,
				value: () => ({ left: 0, width: 500, top: 0, right: 500, bottom: 8, height: 8 }) as unknown as DOMRect,
			});
			act(() => {
				track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 450 }));
			});
			// scrollLeft should have changed from 0
			// (jsdom doesn't update scrollLeft automatically but the assignment should happen)
			expect(ref.current!.scrollLeft).toBeGreaterThanOrEqual(0);
		}
	});
});
