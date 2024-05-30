import * as React from 'react';
import styled, { css, CSSObject } from 'styled-components';
import { CellExtended } from './Cell';
import { getFooterProperty } from './util';
import { TableColumn } from './types';

interface FooterCellStyleProps {
	$renderAsCell: boolean | undefined;
	$wrapCell: boolean | undefined;
	$allowOverflow: boolean | undefined;
	$cellStyle: CSSObject | undefined;
	$isDragging: boolean;
}

const overflowCSS = css<FooterCellStyleProps>`
	div:first-child {
		white-space: ${({ $wrapCell }) => ($wrapCell ? 'normal' : 'nowrap')};
		overflow: ${({ $allowOverflow }) => ($allowOverflow ? 'visible' : 'hidden')};
		text-overflow: ellipsis;
	}
`;

const FooterCellStyle = styled(CellExtended).attrs(props => ({
	style: props.style,
}))<FooterCellStyleProps>`
	${({ $renderAsCell }) => !$renderAsCell && overflowCSS};
	${({ theme, $isDragging }) => $isDragging && theme.cells.draggingStyle};
	${({ $cellStyle }) => $cellStyle};
`;

interface FooterCellProps<T> {
	id: string;
	dataTag: string | null;
	column: TableColumn<T>;
	rows: Array<T>;
	isDragging: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

function FooterCell<T>({
	id,
	column,
	rows,
	dataTag,
	isDragging,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
}: FooterCellProps<T>): JSX.Element {
	return (
		<FooterCellStyle
			id={id}
			data-column-id={column.id}
			role="cell"
			className="rdt_TableFooterCell"
			data-tag={dataTag}
			$cellStyle={column.style}
			$renderAsCell={!!column.cell}
			$allowOverflow={column.allowOverflow}
			button={column.button}
			center={column.center}
			compact={column.compact}
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			width={column.width}
			$wrapCell={column.wrap}
			$isDragging={isDragging}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			<div data-tag={dataTag}>{getFooterProperty(rows, column.footerContent)}</div>
		</FooterCellStyle>
	);
}

export default React.memo(FooterCell) as typeof FooterCell;
