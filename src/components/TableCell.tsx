import * as React from 'react';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle, getPinnedCellMeta } from '../util';
import type { TableColumn, CellEditor } from '../types';

interface CellProps<T> {
	id: string;
	dataTag: string | null;
	column: TableColumn<T>;
	row: T;
	rowIndex: number;
	isDragging: boolean;
}

function Cell<T>({ id, column, row, rowIndex, dataTag, isDragging }: CellProps<T>): JSX.Element {
	const customStyles = useStyles();
	const { onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, columnWidths, pinnedOffsets } =
		useRowContext<T>();
	const resizedWidth = column.id != null ? columnWidths[column.id] : undefined;
	const { conditionalStyle, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);

	// ── Inline editing ─────────────────────────────────────────────────────────
	// Resolve the editor descriptor: explicit `editor` wins; otherwise `editable: true`
	// is shorthand for a text editor.
	const editor: CellEditor | undefined = column.editor ?? (column.editable ? { type: 'text' } : undefined);
	const [editing, setEditing] = React.useState(false);
	const [editValue, setEditValue] = React.useState('');
	const inputRef = React.useRef<HTMLInputElement | HTMLSelectElement>(null);

	const startEdit = React.useCallback(() => {
		if (!editor) return;
		const current = column.selector ? String(column.selector(row, rowIndex) ?? '') : '';
		setEditValue(current);
		setEditing(true);
	}, [editor, column, row, rowIndex]);

	React.useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const commitEdit = React.useCallback(
		(value?: string) => {
			const v = value ?? editValue;
			setEditing(false);
			column.onCellEdit?.(row, v, column);
		},
		[column, row, editValue],
	);

	const cancelEdit = React.useCallback(() => setEditing(false), []);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') cancelEdit();
	};

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets);
	const pinnedStyle: React.CSSProperties = pinMeta.style.position === 'sticky' ? { ...pinMeta.style, zIndex: 1 } : {};
	const pinnedClass = pinMeta.className;

	const editableClass = editor && !editing ? 'rdt_cellEditable' : '';
	const editingClass = editing ? 'rdt_cellEditing' : '';

	return (
		<CellExtended
			id={id}
			data-column-id={column.id}
			role="cell"
			className={[classNames, pinnedClass, editableClass, editingClass].filter(Boolean).join(' ')}
			data-tag={dataTag}
			button={column.button}
			center={column.center}
			compact={column.compact}
			grow={resizedWidth != null ? 0 : column.grow}
			hide={column.hide}
			maxWidth={resizedWidth != null ? `${resizedWidth}px` : column.maxWidth}
			minWidth={resizedWidth != null ? `${resizedWidth}px` : column.minWidth}
			right={column.right}
			width={resizedWidth != null ? `${resizedWidth}px` : column.width}
			cellStyle={customStyles.cells?.style as React.CSSProperties}
			style={{
				...(column.style as React.CSSProperties),
				...(isDragging ? (customStyles.cells?.draggingStyle as React.CSSProperties) : undefined),
				...(conditionalStyle as React.CSSProperties),
				...pinnedStyle,
			}}
			onDragStart={column.reorder ? onDragStart : (e: React.DragEvent) => e.preventDefault()}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onClick={editor && !editing ? startEdit : undefined}
		>
			{editing && editor?.type === 'text' && (
				<input
					ref={inputRef as React.RefObject<HTMLInputElement>}
					className="rdt_editInput"
					value={editValue}
					placeholder={editor.placeholder}
					onChange={e => setEditValue(e.target.value)}
					onBlur={() => commitEdit()}
					onKeyDown={handleInputKeyDown}
					onClick={e => e.stopPropagation()}
				/>
			)}
			{editing && editor?.type === 'select' && (
				<select
					ref={inputRef as React.RefObject<HTMLSelectElement>}
					className="rdt_editSelect"
					value={editValue}
					onChange={e => {
						setEditValue(e.target.value);
						commitEdit(e.target.value);
					}}
					onBlur={() => commitEdit()}
					onKeyDown={handleInputKeyDown}
					onClick={e => e.stopPropagation()}
				>
					{editor.placeholder !== undefined && (
						<option value="" disabled hidden>
							{editor.placeholder}
						</option>
					)}
					{editor.options.map(opt => (
						<option key={opt.value} value={opt.value}>
							{typeof opt.label === 'string' || typeof opt.label === 'number' ? opt.label : opt.value}
						</option>
					))}
				</select>
			)}
			{!editing && (
				<>
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
				</>
			)}
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
