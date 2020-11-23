import * as React from 'react';
import styled, { css, CSSObject } from 'styled-components';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';
import { getConditionalStyle, getProperty, isOdd, noop } from './util';
import { defaultProps } from './defaultProps';
import { STOP_PROP_TAG } from './constants';
import { RowRecord, SingleRowAction, TableProps } from './types';

const highlightCSS = css<{
	highlightOnHover?: boolean;
}>`
	&:hover {
		${({ highlightOnHover, theme }) => highlightOnHover && theme.rows.highlightOnHoverStyle};
	}
`;

const pointerCSS = css`
	&:hover {
		cursor: pointer;
	}
`;

const TableRowStyle = styled.div<{
	dense?: boolean;
	extendedRowStyle?: CSSObject;
	highlightOnHover?: boolean;
	pointerOnHover?: boolean;
	selected?: boolean;
	striped?: boolean;
}>`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({ theme }) => theme.rows.style};
	${({ dense, theme }) => dense && theme.rows.denseStyle};
	${({ striped, theme }) => striped && theme.rows.stripedStyle};
	${({ highlightOnHover }) => highlightOnHover && highlightCSS};
	${({ pointerOnHover }) => pointerOnHover && pointerCSS};
	${({ selected, theme }) => selected && theme.rows.selectedHighlightStyle};
	${({ extendedRowStyle }) => extendedRowStyle};
`;

type DProps<T> = Pick<
	TableProps<T>,
	| 'columns'
	| 'conditionalRowStyles'
	| 'dense'
	| 'expandableIcon'
	| 'expandableRows'
	| 'expandableRowsComponent'
	| 'expandableRowsHideExpander'
	| 'expandOnRowClicked'
	| 'expandOnRowDoubleClicked'
	| 'highlightOnHover'
	| 'expandableInheritConditionalStyles'
	| 'keyField'
	| 'onRowClicked'
	| 'onRowDoubleClicked'
	| 'onRowExpandToggled'
	| 'pointerOnHover'
	| 'selectableRowDisabled'
	| 'selectableRows'
	| 'selectableRowsComponent'
	| 'selectableRowsComponentProps'
	| 'selectableRowsHighlight'
	| 'striped'
>;

interface TableRowProps<T> extends Required<DProps<T>> {
	defaultExpanded?: boolean;
	defaultExpanderDisabled: boolean;
	id: string | number;
	onSelectedRow: (action: SingleRowAction<T>) => void;
	pointerOnHover: boolean;
	row: T;
	rowCount: number;
	rowIndex: number;
	selected: boolean;
}

function TableRow<T extends RowRecord>({
	columns = [],
	conditionalRowStyles = [],
	defaultExpanded = false,
	defaultExpanderDisabled = false,
	dense = false,
	expandableIcon = defaultProps.expandableIcon,
	expandableRows = false,
	expandableRowsComponent = defaultProps.expandableRowsComponent,
	expandableRowsHideExpander,
	expandOnRowClicked = false,
	expandOnRowDoubleClicked = false,
	highlightOnHover = false,
	id,
	expandableInheritConditionalStyles,
	keyField = defaultProps.keyField,
	onRowClicked = noop,
	onRowDoubleClicked = noop,
	onRowExpandToggled = noop,
	onSelectedRow = noop,
	pointerOnHover = false,
	row,
	rowCount,
	rowIndex,
	selectableRowDisabled = null,
	selectableRows = false,
	selectableRowsComponent = defaultProps.selectableRowsComponent,
	selectableRowsComponentProps = defaultProps.selectableRowsComponentProps,
	selectableRowsHighlight = false,
	selected,
	striped = false,
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

	const extendedRowStyle = getConditionalStyle(row, conditionalRowStyles);
	const hightlightSelected = selectableRowsHighlight && selected;
	const inheritStyles = expandableInheritConditionalStyles ? extendedRowStyle : {};
	const isStriped = striped && isOdd(rowIndex);

	return (
		<>
			<TableRowStyle
				id={`row-${id}`}
				role="row"
				striped={isStriped}
				highlightOnHover={highlightOnHover}
				pointerOnHover={!defaultExpanderDisabled && showPointer}
				dense={dense}
				onClick={handleRowClick}
				onDoubleClick={handleRowDoubleClick}
				className="rdt_TableRow"
				extendedRowStyle={extendedRowStyle}
				selected={hightlightSelected}
			>
				{selectableRows && (
					<TableCellCheckbox
						keyField={keyField}
						row={row}
						rowCount={rowCount}
						selected={selected}
						selectableRowsComponent={selectableRowsComponent}
						selectableRowsComponentProps={selectableRowsComponentProps}
						selectableRowDisabled={selectableRowDisabled}
						onSelectedRow={onSelectedRow}
					/>
				)}

				{expandableRows && !expandableRowsHideExpander && (
					<TableCellExpander
						id={row[keyField] as string}
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

					// apply a tag that TableRow will use to stop event propagation when TableCell is clicked
					const dataTag = column.ignoreRowClick || column.button ? null : STOP_PROP_TAG;
					const extendedCellStyle = getConditionalStyle(row, column.conditionalCellStyles);

					return (
						<TableCell
							id={`cell-${column.id}-${row[keyField]}`}
							key={`cell-${column.id}-${row[keyField]}`}
							extendedCellStyle={extendedCellStyle}
							dataTag={dataTag}
							renderAsCell={!!column.cell}
							column={column}
						>
							{!column.cell && (
								<div data-tag={dataTag}>{getProperty(row, column.selector, column.format, rowIndex)}</div>
							)}
							{column.cell && column.cell(row, rowIndex, column, id)}
						</TableCell>
					);
				})}
			</TableRowStyle>

			{expandableRows && expanded && (
				<ExpanderRow key={`expander--${row[keyField]}`} data={row} extendedRowStyle={inheritStyles}>
					{expandableRowsComponent}
				</ExpanderRow>
			)}
		</>
	);
}

export default TableRow;
