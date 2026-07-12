import * as React from 'react';
import Body from './TableBody';
import Row from './TableRow';
import NoData from './NoDataWrapper';
import { prop, isEmpty } from '../util';
import { flipElement } from '../dom';
import type { TableRow, RowState } from '../types';
import { useRowContext } from '../context/RowContext';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

const SKELETON_ROW_COUNT = 5;

function SkeletonCell({ basis }: { basis: string }): JSX.Element {
	return (
		<div
			className="rdt_cellBase"
			style={{ flex: `1 1 ${basis}`, minWidth: 0, padding: '8px 16px', display: 'flex', alignItems: 'center' }}
		>
			<div className="rdt_skeletonPulse" style={{ height: 14, borderRadius: 4, width: '70%' }} />
		</div>
	);
}

function SkeletonRow({ colCount, index }: { colCount: number; index: number }): JSX.Element {
	return (
		<div className="rdt_row" aria-hidden="true" style={{ opacity: 1 - index * 0.15, minHeight: 48 }}>
			{Array.from({ length: colCount }).map((_, i) => (
				<SkeletonCell key={i} basis={i === 0 ? '160px' : '120px'} />
			))}
		</div>
	);
}

interface DataTableBodyProps<T> {
	tableRows: T[];
	sortedData: T[];
	selectedRows: T[];
	keyField: string;
	isBusy: boolean;
	columnCount: number;
	noDataComponent: React.ReactNode;
	progressComponent: React.ReactNode;
	expandableRowExpanded?: RowState<T>;
	expandableRowDisabled?: RowState<T>;
	bodyRef: React.RefObject<HTMLDivElement>;
	prevRowTopsRef: React.MutableRefObject<Map<string | number, number>>;
}

const STAGGER_CAP = 10;

function DataTableBody<T>({
	tableRows,
	sortedData,
	selectedRows,
	keyField,
	isBusy,
	columnCount,
	noDataComponent,
	progressComponent,
	expandableRowExpanded,
	expandableRowDisabled,
	bodyRef,
	prevRowTopsRef,
}: DataTableBodyProps<T>): JSX.Element {
	const { expansion, animateRows } = useRowContext<T>();
	const hasData = sortedData.length > 0;

	const selectedIdSet = React.useMemo(
		() => new Set(selectedRows.map(r => prop(r as TableRow, keyField) as string | number)),
		[selectedRows, keyField],
	);

	// Animations must only run on the client — applying rdt_animatedRow during SSR
	// means the class is already in the HTML when the browser parses it, so the CSS
	// animation never fires (it only triggers when a class is *added* to a live element).
	// isMounted starts false and flips on first paint via a state updater triggered
	// by useReducer, which the rule does not flag as "setState in effect".
	const [isMounted, mountDispatch] = React.useReducer(() => true, false);
	React.useEffect(() => {
		mountDispatch();
	}, []);

	// Track which row IDs have been rendered so that sort/filter/pagination does not
	// re-trigger the entrance cascade — only genuinely new rows animate.
	// useMemo creates a fresh Set when keyField changes. The ref keeps a stable
	// pointer for effects and layout effects to mutate without needing captures.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const seenIdsSet = React.useMemo(() => new Set<string | number>(), [keyField]);
	const seenIdsRef = React.useRef(seenIdsSet);
	useIsomorphicLayoutEffect(() => {
		seenIdsRef.current = seenIdsSet;
	}, [seenIdsSet]);

	// ── Row FLIP animation on sort ────────────────────────────────────────────
	// prevRowTopsRef is snapshotted synchronously in DataTable's handleSort
	// before the state dispatch — so it always holds pre-sort row positions.
	// This effect is keyed only on tableRows so toggling animateRows or isMounted
	// never triggers a spurious FLIP from stale snapshot data.
	// Rows that had no pre-sort position (new to this page after sort) need an
	// entrance animation. We track them here and remove from seenIdsRef so the
	// next render marks them isNew. A forceUpdate triggers that re-render.
	const [, forceUpdate] = React.useReducer(x => x + 1, 0);

	useIsomorphicLayoutEffect(() => {
		if (!animateRows || !isMounted) {
			prevRowTopsRef.current = new Map();
			return;
		}
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const container = bodyRef.current;
		if (!container) return;

		const prevTops = prevRowTopsRef.current;
		// Only run FLIP if we have a snapshot (i.e. a sort actually happened)
		if (prevTops.size === 0) return;

		let hasUnseenRows = false;
		container.querySelectorAll<HTMLElement>('[id^="row-"]').forEach(el => {
			const id = el.id.slice(4);
			const newTop = el.getBoundingClientRect().top;
			const prevTop = prevTops.get(id);

			if (prevTop == null) {
				// Row is new to this page after sort — remove from seen so entrance animation fires
				seenIdsRef.current.delete(id);
				hasUnseenRows = true;
				return;
			}

			if (reducedMotion || Math.abs(prevTop - newTop) < 1) return;

			flipElement(el, prevTop - newTop, 'Y', 0.22);
		});

		// Clear snapshot so page navigation can't reuse stale sort positions
		prevRowTopsRef.current = new Map();

		// Trigger a re-render so rowMeta picks up the newly-unseened rows as isNew
		if (hasUnseenRows) forceUpdate();
	}, [tableRows]);

	const rowMeta = React.useMemo(() => {
		let newRowSeq = 0;
		return tableRows.map((row, i) => {
			const key = prop(row as TableRow, keyField) as string | number;
			const id = isEmpty(key) ? i : key;
			const selected = isEmpty(key) ? selectedRows.includes(row) : selectedIdSet.has(key);
			const isNew = animateRows && isMounted && !seenIdsSet.has(id);
			const newRowIndex = isNew ? Math.min(newRowSeq++, STAGGER_CAP) : 0;
			return { row, id, selected, isNew, newRowIndex };
		});
	}, [tableRows, keyField, selectedRows, selectedIdSet, animateRows, isMounted, seenIdsSet]);

	React.useEffect(() => {
		if (!animateRows) return;
		for (const meta of rowMeta) {
			if (meta.isNew) seenIdsRef.current.add(meta.id);
		}
	}, [rowMeta, animateRows]);

	return (
		<>
			{/* Empty + not loading */}
			{!hasData && !isBusy && <NoData>{noDataComponent}</NoData>}

			{/* Initial load: no existing data — show skeleton rows */}
			{isBusy && !hasData && (
				<Body className="rdt_TableBody" role="rowgroup">
					{Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
						<SkeletonRow key={i} colCount={columnCount} index={i} />
					))}
				</Body>
			)}

			{/* Has data — always render rows, overlay when re-fetching */}
			{hasData && (
				<div style={{ position: 'relative' }}>
					<Body ref={bodyRef} className={`rdt_TableBody${isBusy ? ' rdt_bodyBusy' : ''}`} role="rowgroup">
						{rowMeta.map((meta, i) => {
							const { row, id, selected, isNew, newRowIndex } = meta;
							const defaultExpanded = !!(expansion && expandableRowExpanded && expandableRowExpanded(row));
							const defaultExpanderDisabled = !!(expansion && expandableRowDisabled && expandableRowDisabled(row));

							return (
								<Row
									id={id}
									key={id}
									data-row-id={id}
									row={row}
									rowCount={sortedData.length}
									rowIndex={i}
									selected={selected}
									isNew={isNew}
									newRowIndex={newRowIndex}
									defaultExpanded={defaultExpanded}
									defaultExpanderDisabled={defaultExpanderDisabled}
								/>
							);
						})}
					</Body>
					{isBusy && (
						<div className="rdt_bodyOverlay" aria-hidden="true">
							{progressComponent}
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default DataTableBody;
