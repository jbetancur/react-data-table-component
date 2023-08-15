import * as React from 'react';
import styled, { css } from 'styled-components';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';
import { prop, equalizeId, getConditionalStyle, isOdd, noop } from './util';
import { STOP_PROP_TAG } from './constants';
import { TableRow, SingleRowAction, TableProps } from './types';

const highlightCSS = css<{
	$highlightOnHover?: boolean;
}>`
	&:hover {
		${({ $highlightOnHover, theme }) => $highlightOnHover && theme.rows.highlightOnHoverStyle};
	}
`;

const pointerCSS = css`
	&:hover {
		cursor: pointer;
	}
`;

const TableRowStyle = styled.div.attrs(props => ({
	style: props.style,
}))<{
	$dense?: boolean;
	$highlightOnHover?: boolean;
	$pointerOnHover?: boolean;
	$selected?: boolean;
	$striped?: boolean;
}>`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({ theme }) => theme.rows.style};
	${({ $dense, theme }) => $dense && theme.rows.denseStyle};
	${({ $striped, theme }) => $striped && theme.rows.stripedStyle};
	${({ $highlightOnHover }) => $highlightOnHover && highlightCSS};
	${({ $pointerOnHover }) => $pointerOnHover && pointerCSS};
	${({ $selected, theme }) => $selected && theme.rows.selectedHighlightStyle};
`;

type DProps<T> = Pick<
	TableProps<T>,
	| 'columns'
	| 'conditionalRowStyles'
	| 'dense'
	| 'expandableIcon'
	| 'expandableRows'
	| 'expandableRowsComponent'
	| 'expandableRowsComponentProps'
	| 'expandableRowsHideExpander'
	| 'expandOnRowClicked'
	| 'expandOnRowDoubleClicked'
	| 'highlightOnHover'
	| 'expandableInheritConditionalStyles'
	| 'keyField'
	| 'onRowClicked'
	| 'onRowDoubleClicked'
	| 'onRowMouseEnter'
	| 'onRowMouseLeave'
	| 'onRowExpandToggled'
	| 'pointerOnHover'
	| 'selectableRowDisabled'
	| 'selectableRows'
	| 'selectableRowsComponent'
	| 'selectableRowsComponentProps'
	| 'selectableRowsHighlight'
	| 'selectableRowsSingle'
	| 'striped'
>;

interface TableRowProps<T> extends Required<DProps<T>> {
	draggingColumnId: number | string;
	defaultExpanded?: boolean;
	defaultExpanderDisabled: boolean;
	id: string | number;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	pointerOnHover: boolean;
	row: T;
	rowCount: number;
	rowIndex: number;
	selected: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

function Row<T>({
	columns = [],
	conditionalRowStyles = [],
	defaultExpanded = false,
	defaultExpanderDisabled = false,
	dense = false,
	expandableIcon,
	expandableRows = false,
	expandableRowsComponent,
	expandableRowsComponentProps,
	expandableRowsHideExpander,
	expandOnRowClicked = false,
	expandOnRowDoubleClicked = false,
	highlightOnHover = false,
	id,
	expandableInheritConditionalStyles,
	keyField,
	onRowClicked = noop,
	onRowDoubleClicked = noop,
	onRowMouseEnter = noop,
	onRowMouseLeave = noop,
	onRowExpandToggled = noop,
	onSelectedRow = noop,
	pointerOnHover = false,
	row,
	rowCount,
	rowIndex,
	selectableRowDisabled = null,
	selectableRows = false,
	selectableRowsComponent,
	selectableRowsComponentProps,
	selectableRowsHighlight = false,
	selectableRowsSingle = false,
	selected,
	striped = false,
	draggingColumnId,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
}: TableRowProps<T>): JSX.Element {
	const [expanded, setExpanded] = React.useState(defaultExpanded);

	React.useEffect(() => {
		setExpanded(defaultExpanded);
	}, [defaultExpanded]);

	const handleExpanded = React.useCallback(() => {
		setExpanded(!expanded);
		onRowExpandToggled(!expanded, row);
	}, [expanded, onRowExpandToggled, row]);

	const showPointer = pointerOnHover || (expandableRows && (expandOnRowClicked || expandOnRowDoubleClicked));

	const handleRowClick = React.useCallback(
		e => {
			// use event delegation allow events to propagate only when the element with data-tag STOP_PROP_TAG is present
			if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
				onRowClicked(row, e);

				if (!defaultExpanderDisabled && expandableRows && expandOnRowClicked) {
					handleExpanded();
				}
			}
		},
		[defaultExpanderDisabled, expandOnRowClicked, expandableRows, handleExpanded, onRowClicked, row],
	);

	const handleRowDoubleClick = React.useCallback(
		e => {
			if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
				onRowDoubleClicked(row, e);
				if (!defaultExpanderDisabled && expandableRows && expandOnRowDoubleClicked) {
					handleExpanded();
				}
			}
		},
		[defaultExpanderDisabled, expandOnRowDoubleClicked, expandableRows, handleExpanded, onRowDoubleClicked, row],
	);

	const handleRowMouseEnter = React.useCallback(
		e => {
			onRowMouseEnter(row, e);
		},
		[onRowMouseEnter, row],
	);

	const handleRowMouseLeave = React.useCallback(
		e => {
			onRowMouseLeave(row, e);
		},
		[onRowMouseLeave, row],
	);

	const rowKeyField = prop(row as TableRow, keyField);
	const { style, classNames } = getConditionalStyle(row, conditionalRowStyles, ['rdt_TableRow']);
	const highlightSelected = selectableRowsHighlight && selected;
	const inheritStyles = expandableInheritConditionalStyles ? style : {};
	const isStriped = striped && isOdd(rowIndex);

	return (
		<>
			<TableRowStyle
				id={`row-${id}`}
				role="row"
				$striped={isStriped}
				$highlightOnHover={highlightOnHover}
				$pointerOnHover={!defaultExpanderDisabled && showPointer}
				$dense={dense}
				onClick={handleRowClick}
				onDoubleClick={handleRowDoubleClick}
				onMouseEnter={handleRowMouseEnter}
				onMouseLeave={handleRowMouseLeave}
				className={classNames}
				$selected={highlightSelected}
				style={style}
			>
				{selectableRows && (
					<TableCellCheckbox
						name={`select-row-${rowKeyField}`}
						keyField={keyField}
						row={row}
						rowCount={rowCount}
						selected={selected}
						selectableRowsComponent={selectableRowsComponent}
						selectableRowsComponentProps={selectableRowsComponentProps}
						selectableRowDisabled={selectableRowDisabled}
						selectableRowsSingle={selectableRowsSingle}
						onSelectedRow={onSelectedRow}
					/>
				)}

				{expandableRows && !expandableRowsHideExpander && (
					<TableCellExpander
						id={rowKeyField as string}
						expandableIcon={expandableIcon}
						expanded={expanded}
						row={row}
						onToggled={handleExpanded}
						disabled={defaultExpanderDisabled}
					/>
				)}

				{columns.map(column => {
					if (column.omit) {
						return null;
					}

					return (
						<TableCell
							id={`cell-${column.id}-${rowKeyField}`}
							key={`cell-${column.id}-${rowKeyField}`}
							// apply a tag that Row will use to stop event propagation when TableCell is clicked
							dataTag={column.ignoreRowClick || column.button ? null : STOP_PROP_TAG}
							column={column}
							row={row}
							rowIndex={rowIndex}
							isDragging={equalizeId(draggingColumnId, column.id)}
							onDragStart={onDragStart}
							onDragOver={onDragOver}
							onDragEnd={onDragEnd}
							onDragEnter={onDragEnter}
							onDragLeave={onDragLeave}
						/>
					);
				})}
			</TableRowStyle>

			{expandableRows && expanded && (
				<ExpanderRow
					key={`expander-${rowKeyField}`}
					data={row}
					extendedRowStyle={inheritStyles}
					extendedClassNames={classNames}
					ExpanderComponent={expandableRowsComponent}
					expanderComponentProps={expandableRowsComponentProps}
				/>
			)}
		</>
	);
}

export default Row;
