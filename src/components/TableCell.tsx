import * as React from 'react';
import { useStyles } from '../context/StylesContext';
import { useRowContext } from '../context/RowContext';
import { CellExtended } from './Cell';
import { getProperty, getConditionalStyle, getPinnedCellMeta, getCellWidthProps } from '../util';
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
	const editor: CellEditor<T> | undefined = React.useMemo(
		() => (column.editor as CellEditor<T> | undefined) ?? (column.editable ? { type: 'text' } : undefined),
		[column.editor, column.editable],
	);
	const [editing, setEditing] = React.useState(false);
	const [editValue, setEditValue] = React.useState('');
	const [editError, setEditError] = React.useState<string | null>(null);
	const inputRef = React.useRef<HTMLInputElement | HTMLSelectElement>(null);

	const seedValue = React.useCallback((): string => {
		const raw = column.selector ? column.selector(row, rowIndex) : undefined;
		if (raw == null) return '';
		if (typeof raw === 'boolean') return raw ? 'true' : 'false';
		return String(raw);
	}, [column, row, rowIndex]);

	const startEdit = React.useCallback(() => {
		if (!editor) return;
		setEditValue(seedValue());
		setEditError(null);
		setEditing(true);
	}, [editor, seedValue]);

	React.useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const cancelEdit = React.useCallback(() => {
		setEditing(false);
		setEditError(null);
	}, []);

	const commitEdit = React.useCallback(
		(value?: string) => {
			const v = value ?? editValue;
			if (column.validate) {
				const result = column.validate(v, row, column);
				if (result === false) {
					cancelEdit();
					return;
				}
				if (typeof result === 'string') {
					setEditError(result);
					inputRef.current?.focus();
					return;
				}
			}
			setEditing(false);
			setEditError(null);
			column.onCellEdit?.(row, v, column);
		},
		[column, row, editValue, cancelEdit],
	);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') cancelEdit();
	};

	// ── Column pinning ─────────────────────────────────────────────────────────
	const pinMeta = getPinnedCellMeta(column, pinnedOffsets, 1);

	const editableClass = editor && !editing ? 'rdt_cellEditable' : '';
	const editingClass = editing ? 'rdt_cellEditing' : '';
	const errorClass = editError ? 'rdt_cellEditError' : '';

	// Checkbox editor commits instantly on click — no extra state.
	const handleCheckboxCommit = (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const current = seedValue() === 'true';
		commitEdit(current ? 'false' : 'true');
	};

	return (
		<CellExtended
			id={id}
			data-column-id={column.id}
			role="cell"
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
			onDragStart={column.reorder ? onDragStart : undefined}
			onDragOver={column.reorder ? onDragOver : undefined}
			onDragEnd={column.reorder ? onDragEnd : undefined}
			onDragEnter={column.reorder ? onDragEnter : undefined}
			onDragLeave={column.reorder ? onDragLeave : undefined}
			onClick={editor && !editing && editor.type !== 'checkbox' ? startEdit : undefined}
		>
			{editing && (editor?.type === 'text' || editor?.type === 'number' || editor?.type === 'date') && (
				<input
					ref={inputRef as React.RefObject<HTMLInputElement>}
					type={editor.type === 'text' ? undefined : editor.type}
					className="rdt_editInput"
					value={editValue}
					placeholder={editor.type === 'date' ? undefined : editor.placeholder}
					min={editor.type === 'text' ? undefined : editor.min}
					max={editor.type === 'text' ? undefined : editor.max}
					step={editor.type === 'number' ? editor.step : undefined}
					aria-invalid={!!editError}
					onChange={e => setEditValue(e.target.value)}
					onBlur={() => commitEdit()}
					onKeyDown={handleInputKeyDown}
					onClick={e => e.stopPropagation()}
				/>
			)}
			{editor?.type === 'checkbox' && (
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions
				<div
					className="rdt_editCheckboxWrap"
					onClick={handleCheckboxCommit}
					onKeyDown={e => {
						if (e.key === ' ' || e.key === 'Enter') {
							e.preventDefault();
							handleCheckboxCommit(e as unknown as React.MouseEvent<HTMLDivElement>);
						}
					}}
				>
					<input
						type="checkbox"
						className="rdt_editCheckbox"
						aria-checked={seedValue() === 'true'}
						checked={seedValue() === 'true'}
						onChange={handleCheckboxCommit}
						onClick={e => e.stopPropagation()}
					/>
				</div>
			)}
			{editing && editor?.type === 'select' && (
				<select
					ref={inputRef as React.RefObject<HTMLSelectElement>}
					className="rdt_editSelect"
					value={editValue}
					aria-invalid={!!editError}
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
			{editing && editor?.type === 'custom' && (
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
				<div className="rdt_editCustomWrap" onClick={e => e.stopPropagation()}>
					{/* eslint-disable-next-line react-hooks/refs */}
					{editor.render({
						row,
						value: editValue,
						setValue: setEditValue,
						commit: commitEdit,
						cancel: cancelEdit,
						column,
					})}
				</div>
			)}
			{editError && (
				<span className="rdt_editErrorTip" role="alert">
					{editError}
				</span>
			)}
			{!editing && editor?.type !== 'checkbox' && (
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

export default React.memo(Cell) as typeof Cell;
