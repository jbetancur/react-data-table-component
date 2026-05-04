import * as React from 'react';
import { useStyles } from './StylesContext';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle } from './util';
import { TableColumn } from './types';

interface CellProps<T> {
	id: string;
	dataTag: string | null;
	column: TableColumn<T>;
	row: T;
	rowIndex: number;
	isDragging: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

function Cell<T>({
	id,
	column,
	row,
	rowIndex,
	dataTag,
	isDragging,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
}: CellProps<T>): JSX.Element {
	const customStyles = useStyles();
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
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			width={column.width}
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
