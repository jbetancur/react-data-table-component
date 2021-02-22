import * as React from 'react';
import styled, { css, CSSObject } from 'styled-components';
import { Cell } from './Cell';
import { TableColumnBase } from './types';

interface TableCellStyleProps {
	renderAsCell: boolean | undefined;
	wrapCell: boolean | undefined;
	allowOverflow: boolean | undefined;
	cellStyle: CSSObject | undefined;
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
	${({ cellStyle }) => cellStyle};
`;

interface TableCellProps extends TableColumnBase {
	dataTag: string | null;
	extendedCellStyle: CSSObject;
	id: string;
	column: TableColumnBase;
	renderAsCell: boolean;
	children?: React.ReactNode;
}

function TableCell({ column, dataTag, extendedCellStyle, id, renderAsCell, children }: TableCellProps): JSX.Element {
	return (
		<TableCellStyle
			id={id}
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
		>
			{children}
		</TableCellStyle>
	);
}

export default React.memo(TableCell);
