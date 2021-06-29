import * as React from 'react';
import styled, { css, CSSObject } from 'styled-components';
import { Cell } from './Cell';
import { TableColumnBase } from './types';

interface TableCellStyleProps {
	renderAsCell: boolean | undefined;
	wrapCell: boolean | undefined;
	allowOverflow: boolean | undefined;
	cellStyle: CSSObject | undefined;
	isDragging: boolean;
}

const overflowCSS = css<TableCellStyleProps>`
	div:first-child {
		white-space: ${({ wrapCell }) => (wrapCell ? 'normal' : 'nowrap')};
		overflow: ${({ allowOverflow }) => (allowOverflow ? 'visible' : 'hidden')};
		text-overflow: ellipsis;
	}
`;

const TableCellStyle = styled(Cell).attrs(props => ({
	style: props.style,
}))<TableCellStyleProps>`
	font-size: ${({ theme }) => theme.rows.fontSize};
	font-weight: 400;
	${({ renderAsCell }) => !renderAsCell && overflowCSS};
	${({ theme, isDragging }) => isDragging && theme.cells.draggingStyle};
	${({ cellStyle }) => cellStyle};
`;

interface TableCellProps extends TableColumnBase {
	id: string;
	dataTag: string | null;
	extendedCellStyle: CSSObject;
	column: TableColumnBase;
	renderAsCell: boolean;
	isDragging: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	children?: React.ReactNode;
}

function TableCell({
	id,
	column,
	dataTag,
	extendedCellStyle,
	renderAsCell,
	isDragging,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
	children,
}: TableCellProps): JSX.Element {
	return (
		<TableCellStyle
			id={id}
			data-column-id={column.id}
			role="gridcell"
			className="rdt_TableCell"
			data-tag={dataTag}
			cellStyle={column.style}
			renderAsCell={renderAsCell}
			allowOverflow={column.allowOverflow}
			button={column.button}
			center={column.center}
			compact={column.compact}
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			width={column.width}
			wrapCell={column.wrap}
			style={extendedCellStyle}
			isDragging={isDragging}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{children}
		</TableCellStyle>
	);
}

export default React.memo(TableCell);
