import * as React from 'react';
import Body from './TableBody';
import Row from './TableRow';
import NoData from './NoDataWrapper';
import { prop, isEmpty } from '../util';
import type { TableRow, RowState } from '../types';
import { useRowContext } from '../context/RowContext';

const SKELETON_ROW_COUNT = 5;

function SkeletonCell({ width }: { width: string }): JSX.Element {
	return (
		<div
			className="rdt_cellBase"
			style={{ flex: `0 0 ${width}`, minWidth: width, padding: '8px 16px', display: 'flex', alignItems: 'center' }}
		>
			<div className="rdt_skeletonPulse" style={{ height: 14, borderRadius: 4, width: '70%' }} />
		</div>
	);
}

function SkeletonRow({ colCount, index }: { colCount: number; index: number }): JSX.Element {
	return (
		<div className="rdt_row" aria-hidden="true" style={{ opacity: 1 - index * 0.15, minHeight: 48 }}>
			{Array.from({ length: colCount }).map((_, i) => (
				<SkeletonCell key={i} width={i === 0 ? '160px' : '120px'} />
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
}

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
}: DataTableBodyProps<T>): JSX.Element {
	const { expandableRows } = useRowContext<T>();
	const hasData = sortedData.length > 0;

	const selectedIdSet = React.useMemo(
		() => new Set(selectedRows.map(r => prop(r as TableRow, keyField) as string | number)),
		[selectedRows, keyField],
	);

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
					<Body className={`rdt_TableBody${isBusy ? ' rdt_bodyBusy' : ''}`} role="rowgroup">
						{tableRows.map((row, i) => {
							const key = prop(row as TableRow, keyField) as string | number;
							const id = isEmpty(key) ? i : key;
							const selected = isEmpty(key) ? selectedRows.includes(row) : selectedIdSet.has(key);
							const defaultExpanded = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
							const defaultExpanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));

							return (
								<Row
									id={id}
									key={id}
									data-row-id={id}
									row={row}
									rowCount={sortedData.length}
									rowIndex={i}
									selected={selected}
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
