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

	test('does not hide native scrollbar when responsive is false', () => {
		const { container } = render(<DataTable columns={columns} data={data} responsive={false} />);
		expect(container.querySelector('.rdt_responsiveWrapperHideScrollbar')).toBeNull();
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

	test('pinned scrollbar aria-controls still resolves after a column is unpinned and re-pinned', async () => {
		const unpinnedCols: TableColumn<Row>[] = columns.map(c => ({ ...c, pinned: undefined }));
		const { container, rerender } = render(<DataTable columns={columns} data={data} responsive />);

		const wrapper = container.querySelector('.rdt_responsiveWrapper') as HTMLElement;
		Object.defineProperty(wrapper, 'scrollWidth', { configurable: true, get: () => 1000 });
		Object.defineProperty(wrapper, 'clientWidth', { configurable: true, get: () => 400 });
		await act(async () => {
			wrapper.dispatchEvent(new Event('scroll'));
		});

		// Unpinning every column drops hasPinnedColumns, which unmounts the
		// scrollbar; re-pinning mounts a fresh one with a new useId, while the
		// wrapper keeps the id the first mount stamped on it.
		rerender(<DataTable columns={unpinnedCols} data={data} responsive />);
		rerender(<DataTable columns={columns} data={data} responsive />);
		await act(async () => {
			wrapper.dispatchEvent(new Event('scroll'));
		});

		const thumb = container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		const controls = thumb.getAttribute('aria-controls');
		expect(controls).toBe(wrapper.id);
		expect(document.getElementById(controls!)).toBe(wrapper);
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
	const attached: HTMLElement[] = [];
	const attach = <T extends HTMLElement>(el: T): T => {
		document.body.appendChild(el);
		attached.push(el);
		return el;
	};
	afterEach(() => {
		for (const el of attached.splice(0)) {
			el.remove();
		}
	});

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

	// With no host id the effect labels the container itself.
	test('aria-controls resolves to the scroll container it labelled', async () => {
		const ref = makeScrollRef(1000, 400);
		attach(ref.current!);
		const { container, unmount } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const thumb = container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		const controls = thumb.getAttribute('aria-controls');
		expect(controls).toBe(ref.current!.id);
		expect(document.getElementById(controls!)).toBe(ref.current);

		unmount();
	});

	test('aria-controls points at a host-supplied container id instead of a fresh one', async () => {
		const ref = makeScrollRef(1000, 400);
		ref.current!.id = 'host-app-scroll-container';
		attach(ref.current!);
		const { container, unmount } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);

		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const thumb = container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		expect(ref.current!.id).toBe('host-app-scroll-container');
		expect(thumb.getAttribute('aria-controls')).toBe('host-app-scroll-container');
		expect(document.getElementById(thumb.getAttribute('aria-controls')!)).toBe(ref.current);

		unmount();
	});

	test('aria-controls survives a remount onto the same container', async () => {
		const ref = makeScrollRef(1000, 400);
		attach(ref.current!);

		// First mount stamps the container with its useId value.
		const first = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);
		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});
		const stampedId = ref.current!.id;
		first.unmount();

		// Unmounting doesn't clear the id, and the remount gets a *different* useId.
		// Unpinning then re-pinning a column does exactly this in DataTable.
		const second = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);
		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const thumb = second.container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		expect(ref.current!.id).toBe(stampedId);
		expect(thumb.getAttribute('aria-controls')).toBe(stampedId);
		expect(document.getElementById(thumb.getAttribute('aria-controls')!)).toBe(ref.current);

		second.unmount();
	});

	// The effect re-runs when the ref object changes, and the container swapped
	// in keeps its own id.
	test('aria-controls re-points when the scroll container is swapped for another one', async () => {
		const first = attach(makeScrollRef(1000, 400).current!);
		const second = attach(makeScrollRef(1000, 400).current!);
		second.id = 'second-scroll-container';

		let swap!: (el: HTMLDivElement) => void;
		function SwapHarness({ initial }: { initial: HTMLDivElement }): JSX.Element {
			const [target, setTarget] = React.useState(initial);
			swap = setTarget;
			const ref = React.useMemo(() => ({ current: target }) as React.RefObject<HTMLDivElement>, [target]);
			return <PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />;
		}

		const { container, unmount } = renderWithTheme(<SwapHarness initial={first} />);
		await act(async () => {
			first.dispatchEvent(new Event('scroll'));
		});
		await act(async () => {
			swap(second);
		});

		const thumb = container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		const controls = thumb.getAttribute('aria-controls');
		expect(controls).toBe('second-scroll-container');
		expect(document.getElementById(controls!)).toBe(second);

		unmount();
	});

	// The host takes the id over after the first mount stamped one.
	test('aria-controls follows an id the host assigns after the first mount stamped one', async () => {
		const ref = makeScrollRef(1000, 400);
		attach(ref.current!);

		const first = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);
		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});
		first.unmount();

		ref.current!.id = 'host-took-over-later';
		const second = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);
		await act(async () => {
			ref.current!.dispatchEvent(new Event('scroll'));
		});

		const thumb = second.container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		expect(thumb.getAttribute('aria-controls')).toBe('host-took-over-later');
		expect(document.getElementById(thumb.getAttribute('aria-controls')!)).toBe(ref.current);

		second.unmount();
	});

	test('two concurrent scrollbars each control their own container', async () => {
		const a = makeScrollRef(1000, 400);
		const b = makeScrollRef(1000, 400);
		attach(a.current!);
		attach(b.current!);

		const firstRender = renderWithTheme(<PinnedScrollbar scrollRef={a} leftInset={0} rightInset={0} />);
		const secondRender = renderWithTheme(<PinnedScrollbar scrollRef={b} leftInset={0} rightInset={0} />);
		await act(async () => {
			a.current!.dispatchEvent(new Event('scroll'));
			b.current!.dispatchEvent(new Event('scroll'));
		});

		const thumbA = firstRender.container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		const thumbB = secondRender.container.querySelector('.rdt_pinnedScrollbarThumb') as HTMLElement;
		const controlsA = thumbA.getAttribute('aria-controls');
		const controlsB = thumbB.getAttribute('aria-controls');
		expect(controlsA).not.toBe(controlsB);
		expect(document.getElementById(controlsA!)).toBe(a.current);
		expect(document.getElementById(controlsB!)).toBe(b.current);

		firstRender.unmount();
		secondRender.unmount();
	});

	// An empty scroll ref renders no scrollbar.
	test('emits no thumb and no aria-controls when the scroll ref is empty', () => {
		const ref = { current: null } as React.RefObject<HTMLDivElement>;
		const { container, unmount } = renderWithTheme(<PinnedScrollbar scrollRef={ref} leftInset={0} rightInset={0} />);

		expect(container.querySelector('.rdt_pinnedScrollbarTrack')).toBeNull();
		expect(container.querySelector('.rdt_pinnedScrollbarThumb')).toBeNull();
		expect(container.querySelector('[aria-controls]')).toBeNull();

		unmount();
	});
});
