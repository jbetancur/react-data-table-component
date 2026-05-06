import * as React from 'react';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle } from '../util';
import { TableColumn } from '../types';

interface CellProps<T> {
	id: string;
	dataTag: string | null;
	column: TableColumn<T>;
	row: T;
	rowIndex: number;
	isDragging: boolean;
}

function Cell<T>({ id, column, row, rowIndex, dataTag, isDragging }: CellProps<T>): JSX.Element {
	const customStyles = useStyles();
	const { onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, columnWidths } = useRowContext<T>();
	const resizedWidth = column.id != null ? columnWidths[column.id] : undefined;
	const { conditionalStyle, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);

	return (
		<CellExtended
			id={id}
			data-column-id={column.id}
			role="cell"
			className={classNames}
			data-tag={dataTag}
			button={column.button}
			center={column.center}
			compact={column.compact}
			grow={resizedWidth != null ? 0 : column.grow}
			hide={column.hide}
			maxWidth={resizedWidth != null ? `${resizedWidth}px` : column.maxWidth}
			minWidth={resizedWidth != null ? `${resizedWidth}px` : column.minWidth}
			right={column.right}
			width={resizedWidth != null ? `${resizedWidth}px` : column.width}
			cellStyle={customStyles.cells?.style as React.CSSProperties}
			style={{
				...(column.style as React.CSSProperties),
				...(isDragging ? (customStyles.cells?.draggingStyle as React.CSSProperties) : undefined),
				...(conditionalStyle as React.CSSProperties),
			}}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{!column.cell && (
				<div
					data-tag={dataTag}
					style={{
						whiteSpace: column.wrap ? 'normal' : 'nowrap',
						overflow: column.allowOverflow ? 'visible' : 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{getProperty(row, column.selector, column.format, rowIndex)}
				</div>
			)}
			{column.cell && column.cell(row, rowIndex, column, id)}
		</CellExtended>
	);
}

function areCellPropsEqual<T>(prevProps: CellProps<T>, nextProps: CellProps<T>): boolean {
	if (prevProps.row !== nextProps.row) return false;
	if (prevProps.column !== nextProps.column) return false;
	if (prevProps.isDragging !== nextProps.isDragging) return false;
	if (prevProps.rowIndex !== nextProps.rowIndex) return false;
	if (prevProps.dataTag !== nextProps.dataTag) return false;
	if (prevProps.id !== nextProps.id) return false;
	return true;
}

export default React.memo(Cell, areCellPropsEqual) as typeof Cell;
