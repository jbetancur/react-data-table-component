import * as React from 'react';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import CellEditor from './CellEditor';
import useCellEdit from '../hooks/useCellEdit';
import { getProperty, toReactNode, getConditionalStyle, getPinnedCellMeta, getCellWidthProps } from '../util';
import type { TableColumn } from '../types';

interface CellProps<T> {
	id: string;
	dataTag: string | null;
	column: TableColumn<T>;
	row: T;
	rowIndex: number;
	navCol: number;
	isDragging: boolean;
}

// Hoisted so every cell shares four style objects instead of allocating one each.
const innerCellStyles = {
	base: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
	wrap: { whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' },
	overflow: { whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'ellipsis' },
	wrapOverflow: { whiteSpace: 'normal', overflow: 'visible', textOverflow: 'ellipsis' },
} as const satisfies Record<string, React.CSSProperties>;

function getInnerCellStyle<T>(column: TableColumn<T>): React.CSSProperties {
	if (column.wrap) return column.allowOverflow ? innerCellStyles.wrapOverflow : innerCellStyles.wrap;
	return column.allowOverflow ? innerCellStyles.overflow : innerCellStyles.base;
}

function PlainCell<T>({ id, column, row, rowIndex, navCol, dataTag, isDragging }: CellProps<T>): JSX.Element {
	const customStyles = useStyles();
	const { columnDrag, columnWidths, pinnedOffsets, cellNavigation, activeCell } = useRowContext<T>();
	const resizedWidth = column.id != null ? columnWidths[column.id] : undefined;
	const { conditionalStyle, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);

	const isActive = cellNavigation && activeCell != null && activeCell.row === rowIndex && activeCell.col === navCol;
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets, 1);

	return (
		<CellExtended
			id={id}
			data-column-id={column.id}
			role={cellNavigation ? 'gridcell' : 'cell'}
			className={[classNames, pinMeta.className].filter(Boolean).join(' ')}
			data-tag={dataTag}
			button={column.button}
			center={column.center}
			compact={column.compact}
			hide={column.hide}
			right={column.right}
			{...getCellWidthProps(column, resizedWidth)}
			cellStyle={customStyles.cells?.style as React.CSSProperties}
			style={{
				...(column.style as React.CSSProperties),
				...(isDragging ? (customStyles.cells?.draggingStyle as React.CSSProperties) : undefined),
				...(conditionalStyle as React.CSSProperties),
				...pinMeta.style,
			}}
			draggable={column.reorder || undefined}
			onDragStart={column.reorder ? columnDrag.onDragStart : undefined}
			onDragOver={column.reorder ? columnDrag.onDragOver : undefined}
			onDragEnd={column.reorder ? columnDrag.onDragEnd : undefined}
			onDragEnter={column.reorder ? columnDrag.onDragEnter : undefined}
			onDragLeave={column.reorder ? columnDrag.onDragLeave : undefined}
			tabIndex={cellNavigation ? (isActive ? 0 : -1) : undefined}
			data-nav-row={cellNavigation ? rowIndex : undefined}
			data-nav-col={cellNavigation ? navCol : undefined}
		>
			{!column.cell && (
				<div data-tag={dataTag} style={getInnerCellStyle(column)}>
					{toReactNode(getProperty(row, column.selector, column.format, rowIndex))}
				</div>
			)}
			{column.cell && column.cell(row, rowIndex, column, id)}
		</CellExtended>
	);
}

function EditableCell<T>({ id, column, row, rowIndex, navCol, dataTag, isDragging }: CellProps<T>): JSX.Element {
	const customStyles = useStyles();
	const { columnDrag, columnWidths, pinnedOffsets, cellNavigation, activeCell } = useRowContext<T>();
	const resizedWidth = column.id != null ? columnWidths[column.id] : undefined;
	const { conditionalStyle, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);

	// ── Inline editing ─────────────────────────────────────────────────────────
	const edit = useCellEdit(column, row, rowIndex);
	const { editor, editing, editError, startEdit, handleCheckboxCommit } = edit;

	// ── Cell navigation ────────────────────────────────────────────────────────
	// Roving tabindex: exactly one cell in the grid is a Tab stop. Arrow-key movement
	// and focus placement are handled centrally on the table element (see
	// handleNavKeyDown in DataTable); this cell only renders its coordinates, its
	// tabindex, and the editing keys.
	const isActive = cellNavigation && activeCell != null && activeCell.row === rowIndex && activeCell.col === navCol;

	// Return focus to the cell wrapper when editing ends (Enter/Escape/blur unmounts the
	// input, which would otherwise drop focus to <body> and out of the grid entirely).
	// `id` (the cell's DOM id, `column.id` + row keyField) is not unique across tables,
	// so this holds a ref to the cell's own node rather than looking it up by id.
	// The wasEditing guard stops re-renders that merely make this cell the clamped
	// active cell (sort, filter, page change) from stealing focus from elsewhere.
	const cellRef = React.useRef<HTMLDivElement>(null);
	const wasEditingRef = React.useRef(false);
	React.useEffect(() => {
		if (cellNavigation && isActive && wasEditingRef.current && !editing) {
			const el = cellRef.current;
			if (el && (document.activeElement === document.body || el.contains(document.activeElement))) el.focus();
		}
		wasEditingRef.current = editing;
	}, [cellNavigation, isActive, editing]);

	const handleCellKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// While editing, keys belong to the editor input.
		if (editing) return;

		if ((e.key === 'Enter' || e.key === 'F2') && editor && editor.type !== 'checkbox') {
			e.preventDefault();
			startEdit();
			return;
		}

		if (e.key === ' ' && editor?.type === 'checkbox') {
			e.preventDefault();
			handleCheckboxCommit(e as unknown as React.MouseEvent<HTMLDivElement>);
		}
	};

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets, 1);

	const editableClass = editor && !editing ? 'rdt_cellEditable' : '';
	const editingClass = editing ? 'rdt_cellEditing' : '';
	const errorClass = editError ? 'rdt_cellEditError' : '';

	return (
		<CellExtended
			ref={cellRef}
			id={id}
			data-column-id={column.id}
			role={cellNavigation ? 'gridcell' : 'cell'}
			className={[classNames, pinMeta.className, editableClass, editingClass, errorClass].filter(Boolean).join(' ')}
			data-tag={dataTag}
			button={column.button}
			center={column.center}
			compact={column.compact}
			hide={column.hide}
			right={column.right}
			{...getCellWidthProps(column, resizedWidth)}
			cellStyle={customStyles.cells?.style as React.CSSProperties}
			style={{
				...(column.style as React.CSSProperties),
				...(isDragging ? (customStyles.cells?.draggingStyle as React.CSSProperties) : undefined),
				...(conditionalStyle as React.CSSProperties),
				...pinMeta.style,
			}}
			draggable={column.reorder || undefined}
			onDragStart={column.reorder ? columnDrag.onDragStart : undefined}
			onDragOver={column.reorder ? columnDrag.onDragOver : undefined}
			onDragEnd={column.reorder ? columnDrag.onDragEnd : undefined}
			onDragEnter={column.reorder ? columnDrag.onDragEnter : undefined}
			onDragLeave={column.reorder ? columnDrag.onDragLeave : undefined}
			tabIndex={cellNavigation ? (isActive ? 0 : -1) : undefined}
			data-nav-row={cellNavigation ? rowIndex : undefined}
			data-nav-col={cellNavigation ? navCol : undefined}
			onKeyDown={cellNavigation ? handleCellKeyDown : undefined}
			onClick={editor && !editing && editor.type !== 'checkbox' ? startEdit : undefined}
		>
			{editor && <CellEditor edit={edit} row={row} column={column} cellNavigation={!!cellNavigation} />}
			{!editing && editor?.type !== 'checkbox' && (
				<>
					{!column.cell && (
						<div data-tag={dataTag} style={getInnerCellStyle(column)}>
							{toReactNode(getProperty(row, column.selector, column.format, rowIndex))}
						</div>
					)}
					{column.cell && column.cell(row, rowIndex, column, id)}
				</>
			)}
		</CellExtended>
	);
}

// Editing needs per-cell state, refs, and an effect. The vast majority of cells
// are not editable, so route them to a hook-free component: at 20k+ cells the
// saved allocations are the difference between a sluggish and an instant page.
function Cell<T>(props: CellProps<T>): JSX.Element {
	return props.column.editor || props.column.editable ? <EditableCell {...props} /> : <PlainCell {...props} />;
}

export default React.memo(Cell) as typeof Cell;
