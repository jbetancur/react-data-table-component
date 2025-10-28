import * as React from 'react';
import styled, { css, CSSObject } from 'styled-components';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle } from './util';
import { TableColumn } from './types';

interface CellStyleProps {
	$renderAsCell: boolean | undefined;
	$wrapCell: boolean | undefined;
	$allowOverflow: boolean | undefined;
	$cellStyle: CSSObject | undefined;
	$isDragging: boolean;
}

const overflowCSS = css<CellStyleProps>`
	div:first-child {
		white-space: ${({ $wrapCell }) => ($wrapCell ? 'normal' : 'nowrap')};
		overflow: ${({ $allowOverflow }) => ($allowOverflow ? 'visible' : 'hidden')};
		text-overflow: ellipsis;
	}
`;

const CellStyle = styled(CellExtended).attrs(props => ({
	style: props.style,
}))<CellStyleProps>`
	${({ $renderAsCell }) => !$renderAsCell && overflowCSS};
	${({ theme, $isDragging }) => $isDragging && theme.cells?.draggingStyle};
	${({ $cellStyle }) => $cellStyle};
`;

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
	const { conditionalStyle, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);

	return (
		<CellStyle
			id={id}
			data-column-id={column.id}
			role="cell"
			className={classNames}
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
			style={conditionalStyle as React.CSSProperties}
			$isDragging={isDragging}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{!column.cell && <div data-tag={dataTag}>{getProperty(row, column.selector, column.format, rowIndex)}</div>}
			{column.cell && column.cell(row, rowIndex, column, id)}
		</CellStyle>
	);
}

// Custom comparison function for React.memo
// Prevents re-renders when non-essential props change
function areCellPropsEqual<T>(prevProps: CellProps<T>, nextProps: CellProps<T>): boolean {
	// If row data changed (by reference), re-render
	if (prevProps.row !== nextProps.row) {
		return false;
	}

	// If column definition changed (reordering, hiding, style changes), re-render
	if (prevProps.column !== nextProps.column) {
		return false;
	}

	// If dragging state changed, re-render
	if (prevProps.isDragging !== nextProps.isDragging) {
		return false;
	}

	// rowIndex can affect formatting functions
	if (prevProps.rowIndex !== nextProps.rowIndex) {
		return false;
	}

	// dataTag affects event propagation
	if (prevProps.dataTag !== nextProps.dataTag) {
		return false;
	}

	// id is stable per cell, but check for safety
	if (prevProps.id !== nextProps.id) {
		return false;
	}

	// Drag handlers are stable (passed from parent), no need to deep compare
	// This is the key optimization - ignoring function reference changes
	return true;
}

export default React.memo(Cell, areCellPropsEqual) as typeof Cell;
