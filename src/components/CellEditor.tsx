import * as React from 'react';
import type { TableColumn } from '../types';
import type { CellEditApi } from '../hooks/useCellEdit';

interface CellEditorProps<T> {
	edit: CellEditApi<T>;
	row: T;
	column: TableColumn<T>;
	cellNavigation: boolean;
}

function CellEditor<T>({ edit, row, column, cellNavigation }: CellEditorProps<T>): JSX.Element {
	const {
		editor,
		editing,
		editValue,
		setEditValue,
		editError,
		inputRef,
		seedValue,
		cancelEdit,
		commitEdit,
		handleInputKeyDown,
		handleCheckboxCommit,
	} = edit;

	return (
		<>
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
						tabIndex={cellNavigation ? -1 : undefined}
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
		</>
	);
}

export default CellEditor;
