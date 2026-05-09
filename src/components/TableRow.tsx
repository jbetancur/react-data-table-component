import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';
import { prop, equalizeId, getConditionalStyle, isOdd } from '../util';
import { STOP_PROP_TAG } from '../constants';
import { TableRow } from '../types';

interface TableRowProps<T> {
	'data-row-id': string | number;
	defaultExpanded: boolean;
	defaultExpanderDisabled: boolean;
	draggingColumnId?: string | number;
	id: string | number;
	row: T;
	rowCount: number;
	rowIndex: number;
	selected: boolean;
}

function Row<T>({
	defaultExpanded = false,
	defaultExpanderDisabled = false,
	draggingColumnId,
	id,
	row,
	rowCount,
	rowIndex,
	selected,
}: TableRowProps<T>): JSX.Element {
	const customStyles = useStyles();
	const {
		columns,
		conditionalRowStyles,
		dense,
		expandableIcon,
		expandableRows,
		expandableRowsComponent,
		expandableRowsComponentProps,
		expandableRowsHideExpander,
		expandOnRowClicked,
		expandOnRowDoubleClicked,
		expandableInheritConditionalStyles,
		highlightOnHover,
		keyField,
		onRowClicked,
		onRowDoubleClicked,
		onRowMiddleClicked,
		onRowMouseEnter,
		onRowMouseLeave,
		onRowExpandToggled,
		onSelectedRow,
		pointerOnHover,
		selectableRowDisabled,
		selectableRows,
		selectableRowsComponent,
		selectableRowsComponentProps,
		selectableRowsHighlight,
		selectableRowsSingle,
		striped,
	} = useRowContext<T>();

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

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Enter') {
				if (!defaultExpanderDisabled && expandableRows && expandOnRowClicked) {
					handleExpanded();
				}
				onRowClicked(row, e as unknown as React.MouseEvent);
			}
		},
		[defaultExpanderDisabled, expandableRows, expandOnRowClicked, handleExpanded, onRowClicked, row],
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

	const handleRowAuxClick = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const target = e.target as HTMLDivElement;
			if (target.getAttribute('data-tag') === STOP_PROP_TAG) {
				onRowMiddleClicked(row, e);
			}
		},
		[onRowMiddleClicked, row],
	);

	const handleRowMouseEnter = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent>) => onRowMouseEnter(row, e),
		[onRowMouseEnter, row],
	);

	const handleRowMouseLeave = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent>) => onRowMouseLeave(row, e),
		[onRowMouseLeave, row],
	);

	const rowKeyField = prop(row as TableRow, keyField) ?? rowIndex;
	const { conditionalStyle, classNames } = React.useMemo(
		() => getConditionalStyle(row, conditionalRowStyles, ['rdt_TableRow']),
		[row, conditionalRowStyles],
	);
	const highlightSelected = selectableRowsHighlight && selected;
	const inheritStyles = expandableInheritConditionalStyles ? conditionalStyle : {};
	const isStriped = striped && isOdd(rowIndex);

	const { animateRows } = useRowContext<T>();
	const className = [
		classNames,
		'rdt_row',
		dense && 'rdt_rowDense',
		isStriped && 'rdt_rowStriped',
		highlightSelected && 'rdt_rowSelected',
		highlightOnHover && 'rdt_rowHighlight',
		!defaultExpanderDisabled && showPointer && 'rdt_rowPointer',
		animateRows && 'rdt_animatedRow',
	]
		.filter(Boolean)
		.join(' ');

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
				tabIndex={!defaultExpanderDisabled && showPointer ? 0 : -1}
				className={className}
				style={style}
				onClick={handleRowClick}
				onKeyDown={handleKeyDown}
				onDoubleClick={handleRowDoubleClick}
				onAuxClick={handleRowAuxClick}
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
						/>
					);
				})}
			</div>

			{expandableRows && expanded && expandableRowsComponent && (
				<ExpanderRow
					key={`expander-${rowKeyField}`}
					data={row}
					extendedRowStyle={inheritStyles}
					extendedClassNames={classNames}
					ExpanderComponent={expandableRowsComponent}
					expanderComponentProps={expandableRowsComponentProps ?? {}}
				/>
			)}
		</>
	);
}

function areRowPropsEqual<T>(prevProps: TableRowProps<T>, nextProps: TableRowProps<T>): boolean {
	if (prevProps.row !== nextProps.row) return false;
	if (prevProps.selected !== nextProps.selected) return false;
	if (prevProps.defaultExpanded !== nextProps.defaultExpanded) return false;
	if (prevProps.defaultExpanderDisabled !== nextProps.defaultExpanderDisabled) return false;
	if (prevProps.draggingColumnId !== nextProps.draggingColumnId) return false;
	if (prevProps.rowCount !== nextProps.rowCount) return false;
	if (prevProps.rowIndex !== nextProps.rowIndex) return false;
	return true;
}

export default React.memo(Row, areRowPropsEqual) as typeof Row;
