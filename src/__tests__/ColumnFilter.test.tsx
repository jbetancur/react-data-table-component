import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColumnFilter from '../components/ColumnFilter';
import { emptyFilterState } from '../hooks/useColumnFilter';
import type { FilterState } from '../types';

function setup(overrides: Partial<React.ComponentProps<typeof ColumnFilter>> = {}) {
	const onChange = vi.fn();
	const utils = render(
		<ColumnFilter
			columnId="name"
			filterValue={emptyFilterState('text')}
			filterType="text"
			onFilterChange={onChange}
			{...overrides}
		/>,
	);
	return { ...utils, onChange };
}

function openPanel(container: HTMLElement) {
	const btn = container.querySelector('button[aria-label="Filter column"], button[aria-label="Filter active"]');
	fireEvent.click(btn as HTMLElement);
}

describe('ColumnFilter:panel open/close', () => {
	test('panel is hidden initially', () => {
		const { container } = setup();
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('clicking the filter icon opens the panel', () => {
		const { container } = setup();
		openPanel(container);
		expect(container.querySelector('.rdt_filterPanel')).not.toBeNull();
	});

	test('pressing Escape closes the panel', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('pressing Escape inside a filter input closes the panel and refocuses the icon', () => {
		const { container } = setup();
		openPanel(container);
		const input = container.querySelector('.rdt_filterInput') as HTMLInputElement;
		input.focus();
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
		expect(document.activeElement).toBe(container.querySelector('.rdt_filterIcon'));
	});

	test('other keys in a filter input do not propagate to the table', () => {
		const documentKeyDown = vi.fn();
		document.addEventListener('keydown', documentKeyDown);
		const { container } = setup();
		openPanel(container);
		fireEvent.keyDown(container.querySelector('.rdt_filterInput') as HTMLInputElement, { key: 'a' });
		document.removeEventListener('keydown', documentKeyDown);
		expect(documentKeyDown).not.toHaveBeenCalled();
	});

	test('clicking outside the panel closes it', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent.pointerDown(document.body);
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('clicking the icon again toggles the panel closed', () => {
		const { container } = setup();
		openPanel(container);
		openPanel(container);
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('scrolling closes the panel', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent.scroll(document);
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('scrolling inside the panel does not close it', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent.scroll(container.querySelector('.rdt_filterPanel') as HTMLElement);
		expect(container.querySelector('.rdt_filterPanel')).not.toBeNull();
	});

	test('window resize closes the panel', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent(window, new Event('resize'));
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});
});

describe('ColumnFilter:Apply and Clear', () => {
	test('Apply calls onFilterChange with pending state and closes the panel', () => {
		const { container, onChange } = setup();
		openPanel(container);

		const input = container.querySelector('input[aria-label="Filter value"]') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'foo' } });

		fireEvent.click(container.querySelector('button.rdt_filterBtnPrimary') as HTMLElement);

		expect(onChange).toBeCalledWith(
			'name',
			expect.objectContaining({ condition1: { operator: 'contains', value: 'foo' } }),
		);
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('Clear resets to empty and calls onFilterChange', () => {
		const { container, onChange } = setup({
			filterValue: { condition1: { operator: 'contains', value: 'foo' } },
		});
		openPanel(container);

		fireEvent.click(container.querySelector('button.rdt_filterBtn:not(.rdt_filterBtnPrimary)') as HTMLElement);

		expect(onChange).toBeCalledWith('name', emptyFilterState('text'));
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});
});

describe('ColumnFilter:operator selection', () => {
	test('changing the operator updates the select', () => {
		const { container } = setup();
		openPanel(container);

		const select = container.querySelector('select[aria-label="Filter operator"]') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'startsWith' } });

		expect(select.value).toBe('startsWith');
	});

	test('selecting "blank" hides the value input (noInput operator)', () => {
		const { container } = setup();
		openPanel(container);

		const select = container.querySelector('select[aria-label="Filter operator"]') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'blank' } });

		expect(container.querySelector('input[aria-label="Filter value"]')).toBeNull();
	});
});

describe('ColumnFilter:between operator (twoInputs)', () => {
	test('shows a second value input when "between" is selected for number type', () => {
		const { container } = setup({ filterType: 'number', filterValue: emptyFilterState('number') });
		openPanel(container);

		const select = container.querySelector('select[aria-label="Filter operator"]') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'between' } });

		expect(container.querySelector('input[aria-label="Filter second value"]')).not.toBeNull();
	});

	test('typing into the second value input updates pending state', () => {
		const { container, onChange } = setup({ filterType: 'number', filterValue: emptyFilterState('number') });
		openPanel(container);

		const select = container.querySelector('select[aria-label="Filter operator"]') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'between' } });

		const input2 = container.querySelector('input[aria-label="Filter second value"]') as HTMLInputElement;
		fireEvent.change(input2, { target: { value: '50' } });

		fireEvent.click(container.querySelector('button.rdt_filterBtnPrimary') as HTMLElement);

		expect(onChange).toBeCalledWith(
			'name',
			expect.objectContaining({ condition1: expect.objectContaining({ value2: '50' }) }),
		);
	});
});

describe('ColumnFilter:second condition (AND/OR)', () => {
	test('clicking "+ Add condition" shows a second condition row', () => {
		const { container } = setup();
		openPanel(container);

		fireEvent.click(container.querySelector('button[aria-label="Add a second filter condition"]') as HTMLElement);

		const selects = container.querySelectorAll('select[aria-label="Filter operator"]');
		expect(selects).toHaveLength(2);
	});

	test('clicking the remove button on the second condition hides it', () => {
		const { container } = setup();
		openPanel(container);

		fireEvent.click(container.querySelector('button[aria-label="Add a second filter condition"]') as HTMLElement);
		fireEvent.click(container.querySelector('button[aria-label="Remove condition"]') as HTMLElement);

		const selects = container.querySelectorAll('select[aria-label="Filter operator"]');
		expect(selects).toHaveLength(1);
	});

	test('switching to OR logic changes the active button', () => {
		const { container } = setup();
		openPanel(container);

		fireEvent.click(container.querySelector('button[aria-label="Add a second filter condition"]') as HTMLElement);

		const logicBtns = container.querySelectorAll('.rdt_filterLogicBtn');
		const orBtn = Array.from(logicBtns).find(b => b.textContent === 'OR') as HTMLButtonElement;
		fireEvent.click(orBtn);

		// After clicking OR, only the OR button should be aria-pressed=true
		const updatedBtns = container.querySelectorAll('.rdt_filterLogicBtn');
		const activeBtn = Array.from(updatedBtns).find(b => b.getAttribute('aria-pressed') === 'true');
		expect(activeBtn?.textContent).toBe('OR');
	});

	test('Apply includes both conditions', () => {
		const { container, onChange } = setup();
		openPanel(container);

		fireEvent.click(container.querySelector('button[aria-label="Add a second filter condition"]') as HTMLElement);

		const inputs = container.querySelectorAll('input[aria-label="Filter value"]');
		fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: 'foo' } });
		fireEvent.change(inputs[1] as HTMLInputElement, { target: { value: 'bar' } });

		fireEvent.click(container.querySelector('button.rdt_filterBtnPrimary') as HTMLElement);

		const called = onChange.mock.calls[0][1] as FilterState;
		expect(called.condition1.value).toBe('foo');
		expect(called.condition2?.value).toBe('bar');
	});
});

describe('ColumnFilter:external filter sync', () => {
	test('re-renders with a new filterValue prop and syncs the pending state', () => {
		const { container, rerender } = setup({
			filterValue: { condition1: { operator: 'contains', value: 'initial' } },
		});
		openPanel(container);

		const input = container.querySelector('input[aria-label="Filter value"]') as HTMLInputElement;
		expect(input.value).toBe('initial');

		rerender(
			<ColumnFilter
				columnId="name"
				filterValue={{ condition1: { operator: 'equals', value: 'updated' } }}
				filterType="text"
				onFilterChange={vi.fn()}
			/>,
		);

		const updatedInput = container.querySelector('input[aria-label="Filter value"]') as HTMLInputElement;
		expect(updatedInput.value).toBe('updated');
	});
});

describe('ColumnFilter:active state', () => {
	test('filter icon shows active class when a filter is applied', () => {
		const { container } = setup({
			filterValue: { condition1: { operator: 'contains', value: 'active' } },
		});

		expect(container.querySelector('.rdt_filterIconActive')).not.toBeNull();
		expect(container.querySelector('.rdt_filterDot')).not.toBeNull();
	});

	test('filter icon shows inactive class when no filter is applied', () => {
		const { container } = setup();
		expect(container.querySelector('.rdt_filterIconActive')).toBeNull();
	});
});

describe('ColumnFilter:date filter type', () => {
	test('renders date inputs for date filterType', () => {
		const { container } = setup({ filterType: 'date', filterValue: emptyFilterState('date') });
		openPanel(container);

		const input = container.querySelector('input[aria-label="Filter value"]') as HTMLInputElement;
		expect(input.type).toBe('date');
	});
});

describe('ColumnFilter:localization (options prop)', () => {
	const options = {
		filterColumnAriaLabel: 'test-filter-col',
		filterActiveAriaLabel: 'test-filter-active',
		filterPanelAriaLabel: 'test-filter-panel',
		operatorAriaLabel: 'test-operator',
		valuePlaceholder: 'test-placeholder',
		valueAriaLabel: 'test-value',
		value2AriaLabel: 'test-value2',
		value2Placeholder: 'test-placeholder2',
		betweenSeparatorText: 'test-sep',
		removeConditionAriaLabel: 'test-remove',
		addConditionAriaLabel: 'test-add',
		addConditionLabel: 'test-add-label',
		clearLabel: 'test-clear',
		applyLabel: 'test-apply',
		andLabel: 'test-and',
		orLabel: 'test-or',
		operators: { contains: 'test-contains', equals: 'test-equals' },
	};

	test('filter icon button uses custom aria-label', () => {
		const { container } = setup({ options });
		const btn = container.querySelector('button') as HTMLButtonElement;
		expect(btn.getAttribute('aria-label')).toBe('test-filter-col');
	});

	test('active filter uses custom active aria-label', () => {
		const { container } = setup({
			options,
			filterValue: { condition1: { operator: 'contains', value: 'x' } },
		});
		const btn = container.querySelector('button') as HTMLButtonElement;
		expect(btn.getAttribute('aria-label')).toBe('test-filter-active');
	});

	function openPanelByClass(container: HTMLElement) {
		const btn = container.querySelector('button.rdt_filterIcon') as HTMLElement;
		fireEvent.click(btn);
	}

	test('panel uses custom aria-label', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		expect(container.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('test-filter-panel');
	});

	test('operator select uses custom aria-label', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		expect(container.querySelector('select')?.getAttribute('aria-label')).toBe('test-operator');
	});

	test('value input uses custom placeholder and aria-label', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.getAttribute('aria-label')).toBe('test-value');
		expect(input.placeholder).toBe('test-placeholder');
	});

	test('custom operator labels appear in select; untranslated keys fall back to default', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		const select = container.querySelector('select') as HTMLSelectElement;
		const optionTexts = Array.from(select.options).map(o => o.text);
		expect(optionTexts).toContain('test-contains');
		expect(optionTexts).toContain('test-equals');
		expect(optionTexts).toContain('Does not contain'); // untranslated key falls back to English default
	});

	test('Apply and Clear buttons use custom labels', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		const btns = Array.from(container.querySelectorAll('.rdt_filterActions button')).map(b => b.textContent);
		expect(btns).toContain('test-clear');
		expect(btns).toContain('test-apply');
	});

	test('add-condition button uses custom label and aria-label', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		const addBtn = container.querySelector('.rdt_filterAddCondition') as HTMLButtonElement;
		expect(addBtn.textContent).toBe('test-add-label');
		expect(addBtn.getAttribute('aria-label')).toBe('test-add');
	});

	test('AND / OR buttons use custom labels', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		fireEvent.click(container.querySelector('.rdt_filterAddCondition') as HTMLElement);
		const logicBtns = Array.from(container.querySelectorAll('.rdt_filterLogicBtn')).map(b => b.textContent);
		expect(logicBtns).toContain('test-and');
		expect(logicBtns).toContain('test-or');
	});

	test('remove-condition button uses custom aria-label', () => {
		const { container } = setup({ options });
		openPanelByClass(container);
		fireEvent.click(container.querySelector('.rdt_filterAddCondition') as HTMLElement);
		const removeBtn = container.querySelector('.rdt_filterRemoveBtn') as HTMLButtonElement;
		expect(removeBtn.getAttribute('aria-label')).toBe('test-remove');
	});

	test('between separator uses custom text', () => {
		const { container } = setup({ options, filterType: 'number', filterValue: emptyFilterState('number') });
		openPanelByClass(container);
		const select = container.querySelector('select') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'between' } });
		expect(container.querySelector('.rdt_filterBetweenSep')?.textContent).toBe('test-sep');
	});

	test('second value input uses custom aria-label and placeholder', () => {
		const { container } = setup({ options, filterType: 'number', filterValue: emptyFilterState('number') });
		openPanelByClass(container);
		const select = container.querySelector('select') as HTMLSelectElement;
		fireEvent.change(select, { target: { value: 'between' } });
		const input2 = container.querySelector('input[aria-label="test-value2"]') as HTMLInputElement;
		expect(input2).not.toBeNull();
		expect(input2.placeholder).toBe('test-placeholder2');
	});
});
