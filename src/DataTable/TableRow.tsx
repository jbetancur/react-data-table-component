import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';
import { prop, equalizeId, getConditionalStyle, isOdd, noop } from './util';
import { STOP_PROP_TAG } from './constants';
import { TableRow, SingleRowAction, TableProps } from './types';

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
	const customStyles = useStyles();
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
		(e: React.MouseEvent<HTMLDivElement>) => {
			const target = e.target as HTMLDivElement;
			if (target.getAttribute('data-tag') === STOP_PROP_TAG) {
				onRowClicked(row, e);
				if (!defaultExpanderDisabled && expandableRows && expandOnRowClicked) {
					handleExpanded();
				}
			}
		},
		[defaultExpanderDisabled, expandOnRowClicked, expandableRows, handleExpanded, onRowClicked, row],
	);

	const handleRowDoubleClick = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const target = e.target as HTMLDivElement;
			if (target.getAttribute('data-tag') === STOP_PROP_TAG) {
				onRowDoubleClicked(row, e);
				if (!defaultExpanderDisabled && expandableRows && expandOnRowDoubleClicked) {
					handleExpanded();
				}
			}
		},
		[defaultExpanderDisabled, expandOnRowDoubleClicked, expandableRows, handleExpanded, onRowDoubleClicked, row],
	);

	const handleRowMouseEnter = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent>) => {
			onRowMouseEnter(row, e);
		},
		[onRowMouseEnter, row],
	);

	const handleRowMouseLeave = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent>) => {
			onRowMouseLeave(row, e);
		},
		[onRowMouseLeave, row],
	);

	const rowKeyField = prop(row as TableRow, keyField);
	const { conditionalStyle, classNames } = getConditionalStyle(row, conditionalRowStyles, ['rdt_TableRow']);
	const highlightSelected = selectableRowsHighlight && selected;
	const inheritStyles = expandableInheritConditionalStyles ? conditionalStyle : {};
	const isStriped = striped && isOdd(rowIndex);

	const className = [
		classNames,
		'rdt_row',
		dense && 'rdt_rowDense',
		isStriped && 'rdt_rowStriped',
		highlightSelected && 'rdt_rowSelected',
		highlightOnHover && 'rdt_rowHighlight',
		!defaultExpanderDisabled && showPointer && 'rdt_rowPointer',
	].filter(Boolean).join(' ');

	const style: React.CSSProperties = {
		...customStyles.rows?.style,
		...(dense && customStyles.rows?.denseStyle),
		...(isStriped && customStyles.rows?.stripedStyle),
		...(highlightSelected && customStyles.rows?.selectedHighlightStyle),
		...(conditionalStyle as React.CSSProperties),
	};

	return (
		<>
			<div
				id={`row-${id}`}
				role="row"
				className={className}
				style={style}
				onClick={handleRowClick}
				onDoubleClick={handleRowDoubleClick}
				onMouseEnter={handleRowMouseEnter}
				onMouseLeave={handleRowMouseLeave}
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
			</div>

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

function areRowPropsEqual<T>(prevProps: TableRowProps<T>, nextProps: TableRowProps<T>): boolean {
	if (prevProps.row !== nextProps.row) return false;
	if (prevProps.selected !== nextProps.selected) return false;
	if (prevProps.columns !== nextProps.columns) return false;
	if (prevProps.defaultExpanded !== nextProps.defaultExpanded) return false;
	if (prevProps.defaultExpanderDisabled !== nextProps.defaultExpanderDisabled) return false;
	if (prevProps.draggingColumnId !== nextProps.draggingColumnId) return false;
	if (prevProps.striped !== nextProps.striped || prevProps.rowIndex !== nextProps.rowIndex) return false;
	if (prevProps.rowCount !== nextProps.rowCount) return false;
	if (prevProps.conditionalRowStyles !== nextProps.conditionalRowStyles) return false;
	if ((prevProps.onRowClicked !== noop) !== (nextProps.onRowClicked !== noop)) return false;
	return true;
}

export default React.memo(Row, areRowPropsEqual) as typeof Row;
