import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColumnFilter from '../components/ColumnFilter';
import { emptyFilterState } from '../hooks/useColumnFilter';

describe('ColumnFilter:viewport positioning', () => {
	let anchor: DOMRect;
	let panelWidth: number;
	let panelHeight: number;

	beforeEach(() => {
		vi.stubGlobal('innerWidth', 800);
		vi.stubGlobal('innerHeight', 600);
		anchor = new DOMRect(40, 40, 22, 22);
		panelWidth = 340;
		panelHeight = 160;
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
			if (this.classList.contains('rdt_filterIcon')) {
				return anchor;
			}
			return new DOMRect(0, 0, panelWidth, panelHeight);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	function openPanel() {
		const result = render(
			<ColumnFilter columnId="name" filterValue={emptyFilterState('text')} onFilterChange={vi.fn()} />,
		);
		fireEvent.click(result.getByRole('button', { name: 'Filter column' }));
		return { ...result, panel: result.getByRole('dialog') };
	}

	test('keeps the below-anchor position when it fits', () => {
		const { panel } = openPanel();
		expect(panel.style.left).toBe('40px');
		expect(panel.style.top).toBe('66px');
	});

	test('uses the measured width at the right viewport edge', () => {
		anchor = new DOMRect(760, 40, 22, 22);
		const { panel } = openPanel();
		expect(panel.style.left).toBe('452px');
	});

	test('keeps a left-scrolled anchor inside the viewport', () => {
		anchor = new DOMRect(-100, 40, 22, 22);
		const { panel } = openPanel();
		expect(panel.style.left).toBe('8px');
	});

	test('flips above an anchor near the bottom edge', () => {
		anchor = new DOMRect(40, 560, 22, 22);
		const { panel } = openPanel();
		expect(panel.style.top).toBe('396px');
	});

	test('fits within the viewport when neither side of the anchor has enough room', () => {
		anchor = new DOMRect(40, 280, 22, 22);
		panelHeight = 400;
		const { panel } = openPanel();
		expect(panel.style.top).toBe('192px');
	});

	test('repositions when adding a condition makes the panel taller and wider', () => {
		anchor = new DOMRect(450, 380, 22, 22);
		const { panel, getByRole } = openPanel();
		expect(panel.style.top).toBe('406px');
		panelWidth = 450;
		panelHeight = 260;
		fireEvent.click(getByRole('button', { name: 'Add a second filter condition' }));
		expect(panel.style.left).toBe('342px');
		expect(panel.style.top).toBe('116px');
	});
});
