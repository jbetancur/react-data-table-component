import * as React from 'react';
import '../DataTable.css';

type ColumnFilterProps = {
	columnId: string | number;
	filterValue: string;
	placeholder?: string;
	onFilterChange: (columnId: string | number, value: string) => void;
};

export default function ColumnFilter({
	columnId,
	filterValue,
	placeholder = 'Filter…',
	onFilterChange,
}: ColumnFilterProps): JSX.Element {
	const [open, setOpen] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	// Close on outside click
	React.useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [open]);

	const isActive = filterValue.length > 0;

	return (
		<div ref={containerRef} className="rdt_filterContainer">
			<button
				type="button"
				className={['rdt_filterIcon', isActive && 'rdt_filterIconActive'].filter(Boolean).join(' ')}
				aria-label={isActive ? `Filter active: ${filterValue}` : 'Filter column'}
				aria-pressed={open}
				onClick={e => {
					e.stopPropagation();
					setOpen(v => !v);
				}}
				tabIndex={0}
			>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
					<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
				</svg>
				{isActive && <span className="rdt_filterDot" />}
			</button>
			{open && (
				<div className="rdt_filterPopup">
					<input
						ref={inputRef}
						className="rdt_filterInput"
						type="text"
						value={filterValue}
						placeholder={placeholder}
						onChange={e => onFilterChange(columnId, e.target.value)}
						onKeyDown={e => {
							e.stopPropagation();
							if (e.key === 'Escape') setOpen(false);
						}}
						aria-label={`Filter ${String(columnId)}`}
					/>
					{isActive && (
						<button
							type="button"
							className="rdt_filterClear"
							aria-label="Clear filter"
							onClick={() => {
								onFilterChange(columnId, '');
								inputRef.current?.focus();
							}}
						>
							✕
						</button>
					)}
				</div>
			)}
		</div>
	);
}
