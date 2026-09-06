import * as React from 'react';
import '../DataTable.css';
import type { FilterState, FilterCondition, FilterOperator, FilterType, Localization } from '../types';
import { emptyFilterState, isFilterActive, isValueSelected } from '../hooks/useColumnFilter';
import { emptyCondition, inputTypeFor, operatorsFor } from './filterOperators';
import FilterIcon from '../icons/FilterIcon';
import Checkbox from './Checkbox';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

type ColumnFilterOptions = NonNullable<Localization['filter']>;

// Shield the table's keyboard handlers (cell navigation, sort) from keystrokes in
// filter inputs, but let Escape through so the panel's close handler still fires.
function stopUnlessEscape(e: React.KeyboardEvent) {
	if (e.key !== 'Escape') {
		e.stopPropagation();
	}
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
	const inputType = inputTypeFor(filterType);
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

type SetFilterPanelProps = {
	values: string[];
	selected: string[] | undefined;
	knownValues: string[] | undefined;
	options: ColumnFilterOptions;
	onChange: (next: string[]) => void;
};

function SetFilterPanel({ values, selected, knownValues, options, onChange }: SetFilterPanelProps): JSX.Element {
	const [search, setSearch] = React.useState('');

	const isChecked = (value: string) => isValueSelected(value, selected, knownValues);

	const searching = search.trim() !== '';

	const visible = React.useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) {
			return values;
		}
		const blanksLabel = options.blanksLabel ?? '(Blanks)';
		return values.filter(v => (v === '' ? blanksLabel : v).toLowerCase().includes(q));
	}, [values, search, options.blanksLabel]);

	const allVisibleChecked = visible.length > 0 && visible.every(isChecked);
	const someVisibleChecked = visible.some(isChecked);

	// Everything shown as checked, including values that are only checked because they
	// showed up after the filter was applied. Editing makes them explicit.
	function currentSelection(): Set<string> {
		return new Set(values.filter(isChecked));
	}

	function toggle(value: string) {
		const base = currentSelection();
		if (base.has(value)) {
			base.delete(value);
		} else {
			base.add(value);
		}

		onChange([...base]);
	}

	function toggleAll() {
		// While searching, unchecking select-all means "none of these", the gesture that
		// starts a "show only X". Subtracting from the full selection instead would
		// silently keep the values the search is hiding.
		if (allVisibleChecked && searching) {
			onChange([]);
			return;
		}

		const base = currentSelection();

		for (const v of visible) {
			if (allVisibleChecked) {
				base.delete(v);
			} else {
				base.add(v);
			}
		}
		onChange([...base]);
	}

	return (
		<div className="rdt_filterSet">
			<input
				className="rdt_filterInput rdt_filterSetSearch"
				type="text"
				value={search}
				placeholder={options.searchPlaceholder ?? 'Search'}
				onChange={e => setSearch(e.target.value)}
				onKeyDown={stopUnlessEscape}
				aria-label={options.searchAriaLabel ?? 'Search filter values'}
			/>

			{visible.length === 0 ? (
				<div className="rdt_filterSetEmpty">{options.noMatchesText ?? 'No matches'}</div>
			) : (
				<div className="rdt_filterSetList" role="group">
					<label className="rdt_filterSetItem rdt_filterSetSelectAll">
						<Checkbox
							// While searching it acts only on the matches, which the narrowed list shows
							// but the label alone does not say.
							name={
								searching
									? (options.selectAllFilteredAriaLabel ?? '(Select all) search results')
									: (options.selectAllLabel ?? '(Select all)')
							}
							checked={allVisibleChecked}
							indeterminate={someVisibleChecked && !allVisibleChecked}
							onClick={toggleAll}
						/>
						<span>{options.selectAllLabel ?? '(Select all)'}</span>
					</label>
					{visible.map(value => {
						const label = value === '' ? (options.blanksLabel ?? '(Blanks)') : value;

						return (
							<label key={value} className="rdt_filterSetItem">
								<Checkbox name={label} checked={isChecked(value)} onClick={() => toggle(value)} />
								<span>{label}</span>
							</label>
						);
					})}
				</div>
			)}
		</div>
	);
}

type ConditionLogicGroupProps = {
	condition: FilterCondition | undefined;
	logic: FilterState['logic'];
	filterType: FilterType;
	options: ColumnFilterOptions;
	onLogicChange: (logic: 'AND' | 'OR') => void;
	onChange: (next: FilterCondition) => void;
	onAdd: () => void;
	onRemove: () => void;
};

function ConditionLogicGroup({
	condition,
	logic,
	filterType,
	options,
	onLogicChange,
	onChange,
	onAdd,
	onRemove,
}: ConditionLogicGroupProps): JSX.Element {
	if (!condition) {
		return (
			<button
				type="button"
				className="rdt_filterAddCondition"
				aria-label={options.addConditionAriaLabel ?? 'Add a second filter condition'}
				onClick={onAdd}
			>
				{options.addConditionLabel ?? '+ Add condition'}
			</button>
		);
	}

	return (
		<>
			<div className="rdt_filterLogicRow">
				<button
					type="button"
					className={['rdt_filterLogicBtn', logic !== 'OR' && 'rdt_filterLogicBtnActive'].filter(Boolean).join(' ')}
					aria-pressed={logic !== 'OR'}
					onClick={() => onLogicChange('AND')}
				>
					{options.andLabel ?? 'AND'}
				</button>
				<button
					type="button"
					className={['rdt_filterLogicBtn', logic === 'OR' && 'rdt_filterLogicBtnActive'].filter(Boolean).join(' ')}
					aria-pressed={logic === 'OR'}
					onClick={() => onLogicChange('OR')}
				>
					{options.orLabel ?? 'OR'}
				</button>
			</div>
			<ConditionRow
				condition={condition}
				filterType={filterType}
				options={options}
				onChange={onChange}
				onRemove={onRemove}
			/>
		</>
	);
}

type ColumnFilterProps = {
	columnId: string | number;
	filterValue: FilterState;
	filterType?: FilterType;
	options?: ColumnFilterOptions;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
	/** Only read by `filterType: "set"`. */
	getDistinctValues?: (columnId: string | number) => string[];
};

export default function ColumnFilter({
	columnId,
	filterValue,
	filterType = 'text',
	options = {},
	onFilterChange,
	getDistinctValues,
}: ColumnFilterProps): JSX.Element {
	const isSet = filterType === 'set';
	const [open, setOpen] = React.useState(false);
	const [panelPos, setPanelPos] = React.useState<{ top: number; left: number } | null>(null);
	const [distinctValues, setDistinctValues] = React.useState<string[]>([]);
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

	// Measure after every render: adding a condition or changing filter content can
	// resize an open panel. Position before paint without moving focus or remounting.
	useIsomorphicLayoutEffect(() => {
		const panel = panelRef.current;
		const button = buttonRef.current;
		if (!open || !panel || !button || !panelPos) {
			return;
		}
		const rect = panel.getBoundingClientRect();
		const anchor = button.getBoundingClientRect();
		const margin = 8;
		const left = Math.max(margin, Math.min(anchor.left, window.innerWidth - rect.width - margin));
		let top = anchor.bottom + 4;
		if (top + rect.height > window.innerHeight - margin) {
			const flipped = anchor.top - rect.height - 4;
			top = flipped >= margin ? flipped : Math.max(margin, window.innerHeight - rect.height - margin);
		}
		panel.style.left = `${left}px`;
		panel.style.top = `${Math.max(margin, top)}px`;
		panel.style.visibility = 'visible';
		// Idempotent: this effect re-measures on every render, and re-adding a class the
		// element already carries does not restart the animation.
		panel.classList.add('rdt_popupVisible');
	});

	React.useEffect(() => {
		if (!open) {
			return;
		}

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
				return;
			}
			// A dialog keeps focus inside it: tabbing off the last control would otherwise
			// land behind an open panel, with no way back except the mouse.
			if (e.key !== 'Tab' || !panelRef.current) {
				return;
			}
			const focusable = panelRef.current.querySelectorAll<HTMLElement>(
				'select, input:not([disabled]), button:not([disabled])',
			);
			if (focusable.length === 0) {
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		}
		// The panel is position: fixed, so any scroll (page or the table's own
		// scroll container) moves the anchor button out from under it. Close rather
		// than track — capture phase catches scrolls inside nested containers.
		function handleScroll(e: Event) {
			if (panelRef.current && e.target instanceof Node && panelRef.current.contains(e.target)) {
				return;
			}
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

	function applied(): FilterState {
		if (!isSet || pending.values === undefined) {
			return pending;
		}

		// Written out explicitly, or the new knownValues would turn values that show as
		// checked into exclusions.
		const checked = distinctValues.filter(v => isValueSelected(v, pending.values, pending.knownValues));

		return { ...pending, values: checked, knownValues: distinctValues };
	}

	function handleApply() {
		onFilterChange(columnId, applied());
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
			if (isSet && getDistinctValues) {
				setDistinctValues(getDistinctValues(columnId));
			}
			const rect = buttonRef.current.getBoundingClientRect();
			setPanelPos({ top: rect.bottom + 4, left: rect.left });
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
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={e => {
					e.stopPropagation();
					toggleOpen();
				}}
			>
				<FilterIcon />
				{isActive && <span className="rdt_filterDot" />}
			</button>

			{open && panelPos && (
				<div
					ref={panelRef}
					className="rdt_popup rdt_filterPanel"
					role="dialog"
					aria-label={options.filterPanelAriaLabel ?? 'Column filter'}
					style={{ position: 'fixed', top: panelPos.top, left: panelPos.left, visibility: 'hidden' }}
				>
					{isSet ? (
						<SetFilterPanel
							values={distinctValues}
							selected={pending.values}
							knownValues={pending.knownValues}
							options={options}
							onChange={next => setPending(prev => ({ ...prev, values: next, knownValues: undefined }))}
						/>
					) : (
						<ConditionRow
							condition={pending.condition1}
							filterType={filterType}
							options={options}
							onChange={handleCondition1Change}
						/>
					)}

					{!isSet && (
						<ConditionLogicGroup
							condition={pending.condition2}
							logic={pending.logic}
							filterType={filterType}
							options={options}
							onLogicChange={handleLogicChange}
							onChange={handleCondition2Change}
							onAdd={handleAddCondition}
							onRemove={handleRemoveCondition2}
						/>
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
