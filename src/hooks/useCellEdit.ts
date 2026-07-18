import * as React from 'react';
import type { TableColumn, CellEditor } from '../types';

export interface CellEditApi<T> {
	editor: CellEditor<T> | undefined;
	editing: boolean;
	editValue: string;
	setEditValue: React.Dispatch<React.SetStateAction<string>>;
	editError: string | null;
	inputRef: React.MutableRefObject<HTMLElement | null>;
	customInputRef: React.RefCallback<HTMLElement>;
	seedValue: () => string;
	startEdit: () => void;
	cancelEdit: () => void;
	commitEdit: (value?: string) => void;
	handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
	handleCheckboxCommit: (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => void;
}

export default function useCellEdit<T>(column: TableColumn<T>, row: T, rowIndex: number): CellEditApi<T> {
	// Resolve the editor descriptor: explicit `editor` wins; otherwise `editable: true`
	// is shorthand for a text editor.
	const editor: CellEditor<T> | undefined = React.useMemo(
		() => (column.editor as CellEditor<T> | undefined) ?? (column.editable ? { type: 'text' } : undefined),
		[column.editor, column.editable],
	);
	const [editing, setEditing] = React.useState(false);
	const [editValue, setEditValue] = React.useState('');
	const [editError, setEditError] = React.useState<string | null>(null);
	const inputRef = React.useRef<HTMLElement | null>(null);
	const customInputRef = React.useCallback<React.RefCallback<HTMLElement>>(el => {
		inputRef.current = el;
	}, []);

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

	// Checkbox editor commits instantly on click — no extra state.
	const handleCheckboxCommit = (e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const current = seedValue() === 'true';
		commitEdit(current ? 'false' : 'true');
	};

	return {
		editor,
		editing,
		editValue,
		setEditValue,
		editError,
		inputRef,
		customInputRef,
		seedValue,
		startEdit,
		cancelEdit,
		commitEdit,
		handleInputKeyDown,
		handleCheckboxCommit,
	};
}
