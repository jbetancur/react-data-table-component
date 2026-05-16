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

	test('clicking outside the panel closes it', () => {
		const { container } = setup();
		openPanel(container);
		fireEvent.mouseDown(document.body);
		expect(container.querySelector('.rdt_filterPanel')).toBeNull();
	});

	test('clicking the icon again toggles the panel closed', () => {
		const { container } = setup();
		openPanel(container);
		openPanel(container);
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
