import * as React from 'react';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle } from '../util';
import type { TableColumn } from '../types';

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
	const [editing, setEditing] = React.useState(false);
	const [editValue, setEditValue] = React.useState('');
	const inputRef = React.useRef<HTMLInputElement>(null);

	const startEdit = React.useCallback(() => {
		if (!column.editable) return;
		const current = column.selector ? String(column.selector(row, rowIndex) ?? '') : '';
		setEditValue(current);
		setEditing(true);
	}, [column, row, rowIndex]);

	React.useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const commitEdit = React.useCallback(() => {
		setEditing(false);
		column.onCellEdit?.(row, editValue, column);
	}, [column, row, editValue]);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') setEditing(false);
	};

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinnedLeft = column.pinned === 'left' && column.id != null && pinnedOffsets.left[column.id] != null;
	const pinnedRight = column.pinned === 'right' && column.id != null && pinnedOffsets.right[column.id] != null;

	// Largest left offset  = rightmost left-pinned column (shadow on its right)
	// Largest right offset = leftmost right-pinned column (shadow on its left + spacer before it)
	const maxLeftOffset = pinnedLeft ? Math.max(...Object.values(pinnedOffsets.left)) : -1;
	const maxRightOffset = pinnedRight ? Math.max(...Object.values(pinnedOffsets.right)) : -1;
	const isLastLeftPin = pinnedLeft && column.id != null && pinnedOffsets.left[column.id] === maxLeftOffset;
	const isFirstRightPin = pinnedRight && column.id != null && pinnedOffsets.right[column.id] === maxRightOffset;

	const pinnedStyle: React.CSSProperties = pinnedLeft
		? { position: 'sticky', left: pinnedOffsets.left[column.id!], zIndex: 1 }
		: pinnedRight
			? { position: 'sticky', right: pinnedOffsets.right[column.id!], zIndex: 1 }
			: {};

	const pinnedClass = [
		pinnedLeft && 'rdt_pinLeft',
		isLastLeftPin && 'rdt_pinLeftLast',
		pinnedRight && 'rdt_pinRight',
		isFirstRightPin && 'rdt_pinRightFirst',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<CellExtended
			id={id}
			data-column-id={column.id}
			role="cell"
			className={[classNames, pinnedClass].filter(Boolean).join(' ')}
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
			onClick={column.editable && !editing ? startEdit : undefined}
		>
			{editing ? (
				<input
					ref={inputRef}
					className="rdt_editInput"
					value={editValue}
					onChange={e => setEditValue(e.target.value)}
					onBlur={commitEdit}
					onKeyDown={handleInputKeyDown}
					onClick={e => e.stopPropagation()}
				/>
			) : (
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
