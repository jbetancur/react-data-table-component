import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import RightPinSpacer from './RightPinSpacer';
import { getPinnedCellMeta } from '../util';
import type { ColumnFooter, FooterComponent, TableColumn } from '../types';

interface TableFooterProps<T> {
	columns: TableColumn<T>[];
	rows: T[];
	selectableRows: boolean;
	expandableRows: boolean;
	expandableRowsHideExpander: boolean;
	footerComponent?: FooterComponent<T>;
}

function resolveFooter<T>(footer: ColumnFooter<T> | undefined, rows: T[]): React.ReactNode {
	if (footer == null) return null;
	if (typeof footer === 'function') return (footer as (rows: T[]) => React.ReactNode)(rows);
	return footer;
}

function TableFooter<T>({
	columns,
	rows,
	selectableRows,
	expandableRows,
	expandableRowsHideExpander,
	footerComponent: FooterComponentProp,
}: TableFooterProps<T>): JSX.Element {
	const customStyles = useStyles();
	const { columnWidths, pinnedOffsets } = useRowContext<T>();

	// First (leftmost) right-pinned column id — a spacer is injected before it so
	// non-pinned footer cells fill the gap to the right pins, matching TableRow.
	const firstRightPinnedId = React.useMemo(() => {
		for (const col of columns) {
			if (!col.omit && col.pinned === 'right') return col.id;
		}
		return null;
	}, [columns]);

	const style: React.CSSProperties = {
		...(customStyles.footer?.style as React.CSSProperties | undefined),
	};

	if (FooterComponentProp) {
		return (
			<div role="rowgroup" className="rdt_footer" style={style}>
				<FooterComponentProp rows={rows} columns={columns} />
			</div>
		);
	}

	return (
		<div role="rowgroup" className="rdt_footer" style={style}>
			<div role="row" className="rdt_footerRow">
				{selectableRows && <div aria-hidden="true" className="rdt_cellBase rdt_footerSystemCell" />}
				{expandableRows && !expandableRowsHideExpander && (
					<div aria-hidden="true" className="rdt_cellBase rdt_footerSystemCell" />
				)}

				{columns.map(column => {
					if (column.omit) return null;
					const resizedWidth = column.id != null ? columnWidths[column.id] : undefined;
					const pinMeta = getPinnedCellMeta(column, pinnedOffsets);
					const pinnedStyle: React.CSSProperties =
						pinMeta.style.position === 'sticky' ? { ...pinMeta.style, zIndex: 1 } : {};

					return (
						<React.Fragment key={`footer-${column.id}`}>
							{firstRightPinnedId != null && column.id === firstRightPinnedId && <RightPinSpacer />}
							<CellExtended
								role="cell"
								data-column-id={column.id}
								className={['rdt_footerCell', pinMeta.className].filter(Boolean).join(' ')}
								button={column.button}
								center={column.center}
								compact={column.compact}
								grow={resizedWidth != null ? 0 : column.grow}
								hide={column.hide}
								maxWidth={resizedWidth != null ? `${resizedWidth}px` : column.maxWidth}
								minWidth={resizedWidth != null ? `${resizedWidth}px` : column.minWidth}
								right={column.right}
								width={resizedWidth != null ? `${resizedWidth}px` : column.width}
								cellStyle={customStyles.footerCells?.style as React.CSSProperties | undefined}
								style={{ ...(column.style as React.CSSProperties), ...pinnedStyle }}
							>
								{resolveFooter(column.footer, rows)}
							</CellExtended>
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
}

export default TableFooter;
