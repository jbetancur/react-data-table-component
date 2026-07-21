import * as React from 'react';
import '../DataTable.css';
import type { FilterState, FilterCondition, FilterOperator, FilterType, Localization } from '../types';

type ColumnFilterOptions = NonNullable<Localization['filter']>;
import { emptyFilterState, isFilterActive } from '../hooks/useColumnFilter';

type OperatorOption = { value: FilterOperator; label: string; noInput?: boolean; twoInputs?: boolean };

const DEFAULT_TEXT_OPERATORS: OperatorOption[] = [
	{ value: 'contains', label: 'Contains' },
	{ value: 'notContains', label: 'Does not contain' },
	{ value: 'equals', label: 'Equals' },
	{ value: 'notEquals', label: 'Does not equal' },
	{ value: 'startsWith', label: 'Begins with' },
	{ value: 'endsWith', label: 'Ends with' },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

const DEFAULT_NUMBER_OPERATORS: OperatorOption[] = [
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

const DEFAULT_DATE_OPERATORS: OperatorOption[] = [
	{ value: 'equals', label: 'Equals' },
	{ value: 'before', label: 'Before' },
	{ value: 'after', label: 'After' },
	{ value: 'between', label: 'Between', twoInputs: true },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

function operatorsFor(filterType: FilterType, overrides?: ColumnFilterOptions['operators']): OperatorOption[] {
	const base =
		filterType === 'number'
			? DEFAULT_NUMBER_OPERATORS
			: filterType === 'date' || filterType === 'datetime' || filterType === 'time'
				? DEFAULT_DATE_OPERATORS
				: DEFAULT_TEXT_OPERATORS;
	if (!overrides) return base;
	return base.map(op => (overrides[op.value] ? { ...op, label: overrides[op.value]! } : op));
}

function defaultOperator(filterType: FilterType): FilterOperator {
	return filterType === 'text' ? 'contains' : 'equals';
}

function emptyCondition(filterType: FilterType): FilterCondition {
	return { operator: defaultOperator(filterType) };
}

// Shield the table's keyboard handlers (cell navigation, sort) from keystrokes in
// filter inputs, but let Escape through so the panel's close handler still fires.
function stopUnlessEscape(e: React.KeyboardEvent) {
	if (e.key !== 'Escape') e.stopPropagation();
}

type ConditionRowProps = {
	condition: FilterCondition;
	filterType: FilterType;
	options: ColumnFilterOptions;
	onChange: (next: FilterCondition) => void;
	onRemove?: () => void;
};

function ConditionRow({ condition, filterType, options, onChange, onRemove }: ConditionRowProps): JSX.Element {
	const operators = operatorsFor(filterType, options.operators);
	const selected = operators.find(o => o.value === condition.operator) ?? operators[0];
	const inputType =
		filterType === 'number'
			? 'number'
			: filterType === 'date'
				? 'date'
				: filterType === 'datetime'
					? 'datetime-local'
					: filterType === 'time'
						? 'time'
						: 'text';
	// Time inputs default to minute precision; step=1 exposes a seconds field so
	// logs can be filtered to the second.
	const inputStep = filterType === 'time' ? 1 : undefined;

	return (
		<div className="rdt_filterConditionRow">
			<select
				className="rdt_filterSelect"
				value={condition.operator}
				onChange={e => onChange({ operator: e.target.value as FilterOperator })}
				aria-label={options.operatorAriaLabel ?? 'Filter operator'}
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
					step={inputStep}
					value={condition.value ?? ''}
					placeholder={options.valuePlaceholder ?? 'Value'}
					onChange={e => onChange({ ...condition, value: e.target.value })}
					onKeyDown={stopUnlessEscape}
					aria-label={options.valueAriaLabel ?? 'Filter value'}
				/>
			)}

			{selected.twoInputs && (
				<>
					<span className="rdt_filterBetweenSep">{options.betweenSeparatorText ?? 'and'}</span>
					<input
						className="rdt_filterInput"
						type={inputType}
						step={inputStep}
						value={condition.value2 ?? ''}
						placeholder={options.value2Placeholder ?? 'Value'}
						onChange={e => onChange({ ...condition, value2: e.target.value })}
						onKeyDown={stopUnlessEscape}
						aria-label={options.value2AriaLabel ?? 'Filter second value'}
					/>
				</>
			)}

			{onRemove && (
				<button
					type="button"
					className="rdt_filterRemoveBtn"
					onClick={onRemove}
					aria-label={options.removeConditionAriaLabel ?? 'Remove condition'}
				>
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
	options?: ColumnFilterOptions;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
};

export default function ColumnFilter({
	columnId,
	filterValue,
	filterType = 'text',
	options = {},
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

		function handleOutside(e: Event) {
			const target = e.target as Node;
			if (
				containerRef.current &&
				!containerRef.current.contains(target) &&
				panelRef.current &&
				!panelRef.current.contains(target)
			) {
				setOpen(false);
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				setOpen(false);
				buttonRef.current?.focus();
			}
		}
		// The panel is position: fixed, so any scroll (page or the table's own
		// scroll container) moves the anchor button out from under it. Close rather
		// than track — capture phase catches scrolls inside nested containers.
		function handleScroll(e: Event) {
			if (panelRef.current && e.target instanceof Node && panelRef.current.contains(e.target)) return;
			setOpen(false);
		}
		function handleResize() {
			setOpen(false);
		}

		// pointerdown covers mouse + touch in one event and, unlike mousedown, is not
		// re-synthesized after the tap that opened the panel — which on touch devices
		// fired a late emulated mousedown that closed the panel again (flicker).
		document.addEventListener('pointerdown', handleOutside);
		document.addEventListener('keydown', handleKeyDown);
		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleResize);
		return () => {
			document.removeEventListener('pointerdown', handleOutside);
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleResize);
		};
	}, [open]);

	const isActive = isFilterActive(filterValue);

	function handleApply() {
		onFilterChange(columnId, pending);
		setOpen(false);
		buttonRef.current?.focus();
	}

	function handleClear() {
		const empty = emptyFilterState(filterType);
		setPending(empty);
		onFilterChange(columnId, empty);
		setOpen(false);
		buttonRef.current?.focus();
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

	function toggleOpen() {
		if (!open && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const panelMinWidth = 260;
			const margin = 8;
			// Clamp the panel within the viewport on both axes. Anchoring purely to the
			// button's left/right pushes the panel off-screen for columns near either edge
			// (common on mobile once the header is horizontally scrolled), which reads as
			// the menu "not coming up".
			const maxLeft = window.innerWidth - panelMinWidth - margin;
			const left = Math.min(Math.max(margin, rect.left), Math.max(margin, maxLeft));
			setPanelPos({ top: rect.bottom + 4, left });
		}
		setOpen(v => !v);
	}

	return (
		<div ref={containerRef} className="rdt_filterContainer">
			<button
				ref={buttonRef}
				type="button"
				className={['rdt_filterIcon', isActive && 'rdt_filterIconActive'].filter(Boolean).join(' ')}
				aria-label={
					isActive
						? (options.filterActiveAriaLabel ?? 'Filter active')
						: (options.filterColumnAriaLabel ?? 'Filter column')
				}
				aria-pressed={open}
				onClick={e => {
					e.stopPropagation();
					toggleOpen();
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
					aria-label={options.filterPanelAriaLabel ?? 'Column filter'}
					style={{ position: 'fixed', top: panelPos.top, left: panelPos.left }}
				>
					<ConditionRow
						condition={pending.condition1}
						filterType={filterType}
						options={options}
						onChange={handleCondition1Change}
					/>

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
									{options.andLabel ?? 'AND'}
								</button>
								<button
									type="button"
									className={['rdt_filterLogicBtn', pending.logic === 'OR' && 'rdt_filterLogicBtnActive']
										.filter(Boolean)
										.join(' ')}
									aria-pressed={pending.logic === 'OR'}
									onClick={() => handleLogicChange('OR')}
								>
									{options.orLabel ?? 'OR'}
								</button>
							</div>
							<ConditionRow
								condition={pending.condition2}
								filterType={filterType}
								options={options}
								onChange={handleCondition2Change}
								onRemove={handleRemoveCondition2}
							/>
						</>
					) : (
						<button
							type="button"
							className="rdt_filterAddCondition"
							aria-label={options.addConditionAriaLabel ?? 'Add a second filter condition'}
							onClick={handleAddCondition}
						>
							{options.addConditionLabel ?? '+ Add condition'}
						</button>
					)}

					<div className="rdt_filterActions">
						<button type="button" className="rdt_filterBtn" onClick={handleClear}>
							{options.clearLabel ?? 'Clear'}
						</button>
						<button type="button" className="rdt_filterBtn rdt_filterBtnPrimary" onClick={handleApply}>
							{options.applyLabel ?? 'Apply'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
