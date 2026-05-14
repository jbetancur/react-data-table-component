import * as React from 'react';
import '../DataTable.css';
import type { FilterState, FilterCondition, FilterOperator, FilterType } from '../types';
import { emptyFilterState, isFilterActive } from '../hooks/useColumnFilter';

type OperatorOption = { value: FilterOperator; label: string; noInput?: boolean; twoInputs?: boolean };

const TEXT_OPERATORS: OperatorOption[] = [
	{ value: 'contains', label: 'Contains' },
	{ value: 'notContains', label: 'Does not contain' },
	{ value: 'equals', label: 'Equals' },
	{ value: 'notEquals', label: 'Does not equal' },
	{ value: 'startsWith', label: 'Begins with' },
	{ value: 'endsWith', label: 'Ends with' },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

const NUMBER_OPERATORS: OperatorOption[] = [
	{ value: 'equals', label: 'Equals' },
	{ value: 'notEquals', label: 'Does not equal' },
	{ value: 'gt', label: 'Greater than' },
	{ value: 'gte', label: 'Greater than or equal' },
	{ value: 'lt', label: 'Less than' },
	{ value: 'lte', label: 'Less than or equal' },
	{ value: 'between', label: 'Between', twoInputs: true },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

const DATE_OPERATORS: OperatorOption[] = [
	{ value: 'equals', label: 'Equals' },
	{ value: 'before', label: 'Before' },
	{ value: 'after', label: 'After' },
	{ value: 'between', label: 'Between', twoInputs: true },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

function operatorsFor(filterType: FilterType): OperatorOption[] {
	if (filterType === 'number') return NUMBER_OPERATORS;
	if (filterType === 'date') return DATE_OPERATORS;
	return TEXT_OPERATORS;
}

function defaultOperator(filterType: FilterType): FilterOperator {
	return filterType === 'text' ? 'contains' : 'equals';
}

function emptyCondition(filterType: FilterType): FilterCondition {
	return { operator: defaultOperator(filterType) };
}

type ConditionRowProps = {
	condition: FilterCondition;
	filterType: FilterType;
	onChange: (next: FilterCondition) => void;
	onRemove?: () => void;
};

function ConditionRow({ condition, filterType, onChange, onRemove }: ConditionRowProps): JSX.Element {
	const operators = operatorsFor(filterType);
	const selected = operators.find(o => o.value === condition.operator) ?? operators[0];
	const inputType = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';

	return (
		<div className="rdt_filterConditionRow">
			<select
				className="rdt_filterSelect"
				value={condition.operator}
				onChange={e => onChange({ operator: e.target.value as FilterOperator })}
				aria-label="Filter operator"
			>
				{operators.map(op => (
					<option key={op.value} value={op.value}>
						{op.label}
					</option>
				))}
			</select>

			{!selected.noInput && (
				<input
					className="rdt_filterInput"
					type={inputType}
					value={condition.value ?? ''}
					placeholder="Value"
					onChange={e => onChange({ ...condition, value: e.target.value })}
					onKeyDown={e => e.stopPropagation()}
					aria-label="Filter value"
				/>
			)}

			{selected.twoInputs && (
				<>
					<span className="rdt_filterBetweenSep">and</span>
					<input
						className="rdt_filterInput"
						type={inputType}
						value={condition.value2 ?? ''}
						placeholder="Value"
						onChange={e => onChange({ ...condition, value2: e.target.value })}
						onKeyDown={e => e.stopPropagation()}
						aria-label="Filter second value"
					/>
				</>
			)}

			{onRemove && (
				<button type="button" className="rdt_filterRemoveBtn" onClick={onRemove} aria-label="Remove condition">
					✕
				</button>
			)}
		</div>
	);
}

type ColumnFilterProps = {
	columnId: string | number;
	filterValue: FilterState;
	filterType?: FilterType;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
};

export default function ColumnFilter({
	columnId,
	filterValue,
	filterType = 'text',
	onFilterChange,
}: ColumnFilterProps): JSX.Element {
	const [open, setOpen] = React.useState(false);
	const [panelPos, setPanelPos] = React.useState<{ top: number; left: number } | null>(null);
	const [pending, setPending] = React.useState<FilterState>(() => filterValue ?? emptyFilterState(filterType));
	const containerRef = React.useRef<HTMLDivElement>(null);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	// Sync pending state when the applied filter changes externally (e.g. controlled mode reset)
	const prevApplied = React.useRef(filterValue);
	React.useEffect(() => {
		if (prevApplied.current !== filterValue) {
			prevApplied.current = filterValue;
			setPending(filterValue ?? emptyFilterState(filterType));
		}
	}, [filterValue, filterType]);

	const panelRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!open) return;

		const firstFocusable = panelRef.current?.querySelector<HTMLElement>('select, input, button');
		firstFocusable?.focus();

		function handleClick(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node) &&
				panelRef.current &&
				!panelRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') setOpen(false);
		}

		document.addEventListener('mousedown', handleClick);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleClick);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [open]);

	const isActive = isFilterActive(filterValue);

	function handleApply() {
		onFilterChange(columnId, pending);
		setOpen(false);
	}

	function handleClear() {
		const empty = emptyFilterState(filterType);
		setPending(empty);
		onFilterChange(columnId, empty);
		setOpen(false);
	}

	function handleCondition1Change(next: FilterCondition) {
		setPending(prev => ({ ...prev, condition1: next }));
	}

	function handleCondition2Change(next: FilterCondition) {
		setPending(prev => ({ ...prev, condition2: next }));
	}

	function handleAddCondition() {
		setPending(prev => ({
			...prev,
			condition2: emptyCondition(filterType),
			logic: prev.logic ?? 'AND',
		}));
	}

	function handleRemoveCondition2() {
		setPending(prev => ({ condition1: prev.condition1 }));
	}

	function handleLogicChange(logic: 'AND' | 'OR') {
		setPending(prev => ({ ...prev, logic }));
	}

	return (
		<div ref={containerRef} className="rdt_filterContainer">
			<button
				ref={buttonRef}
				type="button"
				className={['rdt_filterIcon', isActive && 'rdt_filterIconActive'].filter(Boolean).join(' ')}
				aria-label={isActive ? 'Filter active' : 'Filter column'}
				aria-pressed={open}
				onClick={e => {
					e.stopPropagation();
					if (!open && buttonRef.current) {
						const rect = buttonRef.current.getBoundingClientRect();
						const panelMinWidth = 260;
						const fitsRight = rect.left + panelMinWidth <= window.innerWidth - 8;
						setPanelPos({
							top: rect.bottom + 4,
							left: fitsRight ? rect.left : rect.right - panelMinWidth,
						});
					}
					setOpen(v => !v);
				}}
			>
				<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
					<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
				</svg>
				{isActive && <span className="rdt_filterDot" />}
			</button>

			{open && panelPos && (
				<div
					ref={panelRef}
					className="rdt_filterPanel"
					role="dialog"
					aria-label="Column filter"
					style={{ position: 'fixed', top: panelPos.top, left: panelPos.left }}
				>
					<ConditionRow condition={pending.condition1} filterType={filterType} onChange={handleCondition1Change} />

					{pending.condition2 ? (
						<>
							<div className="rdt_filterLogicRow">
								<button
									type="button"
									className={['rdt_filterLogicBtn', pending.logic !== 'OR' && 'rdt_filterLogicBtnActive']
										.filter(Boolean)
										.join(' ')}
									aria-pressed={pending.logic !== 'OR'}
									onClick={() => handleLogicChange('AND')}
								>
									AND
								</button>
								<button
									type="button"
									className={['rdt_filterLogicBtn', pending.logic === 'OR' && 'rdt_filterLogicBtnActive']
										.filter(Boolean)
										.join(' ')}
									aria-pressed={pending.logic === 'OR'}
									onClick={() => handleLogicChange('OR')}
								>
									OR
								</button>
							</div>
							<ConditionRow
								condition={pending.condition2}
								filterType={filterType}
								onChange={handleCondition2Change}
								onRemove={handleRemoveCondition2}
							/>
						</>
					) : (
						<button
							type="button"
							className="rdt_filterAddCondition"
							aria-label="Add a second filter condition"
							onClick={handleAddCondition}
						>
							+ Add condition
						</button>
					)}

					<div className="rdt_filterActions">
						<button type="button" className="rdt_filterBtn" onClick={handleClear}>
							Clear
						</button>
						<button type="button" className="rdt_filterBtn rdt_filterBtnPrimary" onClick={handleApply}>
							Apply
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
