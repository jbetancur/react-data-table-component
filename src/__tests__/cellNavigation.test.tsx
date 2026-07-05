import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DataTable from '../components/DataTable';
import type { TableColumn } from '../types';

interface Row {
	id: number;
	name: string;
	age: number;
}

const rows: Row[] = [
	{ id: 1, name: 'Alice', age: 30 },
	{ id: 2, name: 'Bob', age: 40 },
	{ id: 3, name: 'Carol', age: 50 },
];

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, editable: true },
	{ id: 'age', name: 'Age', selector: r => r.age },
];

function getCells(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>('[role="gridcell"]'));
}

function getHeaders(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>('[role="columnheader"]'));
}

describe('cellNavigation', () => {
	test('is off by default — table role and no roving tabindex', () => {
		const { container } = render(<DataTable columns={columns} data={rows} />);
		expect(container.querySelector('[role="table"]')).toBeInTheDocument();
		expect(container.querySelector('[role="grid"]')).not.toBeInTheDocument();
		expect(container.querySelector('[role="gridcell"]')).not.toBeInTheDocument();
		const cells = Array.from(container.querySelectorAll('[role="cell"]'));
		expect(cells.every(c => c.getAttribute('tabindex') === null)).toBe(true);
	});

	test('renders the WAI-ARIA grid pattern when enabled', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		expect(container.querySelector('[role="grid"]')).toBeInTheDocument();
		expect(container.querySelector('[role="table"]')).not.toBeInTheDocument();
		expect(getCells(container)).toHaveLength(6);
	});

	test('first body cell is the only Tab stop before any interaction', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);
		expect(cells[0].getAttribute('tabindex')).toBe('0');
		expect(cells.slice(1).every(c => c.getAttribute('tabindex') === '-1')).toBe(true);
		expect(getHeaders(container).every(h => h.getAttribute('tabindex') === '-1')).toBe(true);
	});

	test('focusing a cell makes it the active (tabIndex 0) cell', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.focus(cells[2]); // row 1, "name" column
		expect(cells[2].getAttribute('tabindex')).toBe('0');
		expect(cells[0].getAttribute('tabindex')).toBe('-1');
	});

	test('ArrowRight/ArrowLeft move focus within the row, clamped at the edges', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(cells[1]);
		expect(cells[1].getAttribute('tabindex')).toBe('0');

		// At the last column, ArrowRight is a no-op.
		fireEvent.keyDown(cells[1], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(cells[1]);

		fireEvent.keyDown(cells[1], { key: 'ArrowLeft' });
		expect(document.activeElement).toBe(cells[0]);

		// At the first column, ArrowLeft is a no-op.
		fireEvent.keyDown(cells[0], { key: 'ArrowLeft' });
		expect(document.activeElement).toBe(cells[0]);
	});

	test('ArrowDown/ArrowUp move focus within the column, clamped at the last row', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.keyDown(cells[0], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cells[2]); // row 1, "name"

		fireEvent.keyDown(cells[2], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cells[4]); // row 2, "name"

		// Last row — ArrowDown is a no-op.
		fireEvent.keyDown(cells[4], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cells[4]);

		fireEvent.keyDown(cells[4], { key: 'ArrowUp' });
		expect(document.activeElement).toBe(cells[2]);
	});

	test('ArrowUp from the first body row moves into the header row', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.keyDown(cells[1], { key: 'ArrowUp' }); // row 0, "age"
		const headers = getHeaders(container);
		expect(document.activeElement).toBe(headers[1]);
		expect(headers[1].getAttribute('tabindex')).toBe('0');

		// Header is the top edge — ArrowUp is a no-op.
		fireEvent.keyDown(headers[1], { key: 'ArrowUp' });
		expect(document.activeElement).toBe(headers[1]);

		// ArrowDown returns to the first body row in the same column.
		fireEvent.keyDown(headers[1], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getCells(container)[1]);
	});

	test('Enter and Space sort from a focused sortable header', () => {
		const sortableColumns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
			{ id: 'age', name: 'Age', selector: r => r.age },
		];
		const { container } = render(<DataTable columns={sortableColumns} data={rows} cellNavigation />);

		fireEvent.keyDown(getCells(container)[0], { key: 'ArrowUp' });
		const header = getHeaders(container)[0];
		expect(document.activeElement).toBe(header);

		fireEvent.keyDown(header, { key: 'Enter' }); // sort asc (already ascending)
		fireEvent.keyDown(header, { key: 'Enter' }); // sort desc
		expect(getCells(container)[0].textContent).toBe('Carol');

		fireEvent.keyDown(header, { key: ' ' }); // back to asc
		expect(getCells(container)[0].textContent).toBe('Alice');
	});

	test('selection checkbox and expander cells are navigable, focusing their widget', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={rows}
				cellNavigation
				selectableRows
				expandableRows
				expandableRowsComponent={() => <div>expanded</div>}
			/>,
		);

		const firstDataCell = container.querySelector<HTMLElement>('[data-nav-row="0"][data-nav-col="2"]')!;
		fireEvent.keyDown(firstDataCell, { key: 'ArrowLeft' });
		const expander = document.activeElement as HTMLElement;
		expect(expander.tagName).toBe('BUTTON');
		expect(expander.getAttribute('tabindex')).toBe('0');

		fireEvent.keyDown(expander, { key: 'ArrowLeft' });
		const checkbox = document.activeElement as HTMLInputElement;
		expect(checkbox.tagName).toBe('INPUT');
		expect(checkbox.type).toBe('checkbox');
		expect(checkbox.getAttribute('tabindex')).toBe('0');

		// ArrowUp from the row checkbox reaches the select-all header checkbox.
		fireEvent.keyDown(checkbox, { key: 'ArrowUp' });
		const selectAll = document.activeElement as HTMLInputElement;
		expect(selectAll.getAttribute('aria-label')).toBe('Select all rows');
	});

	test('the expander header slot is skipped by keyboard nav (no bulk expand/collapse)', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={rows}
				cellNavigation
				selectableRows
				expandableRows
				expandableRowsComponent={() => <div>expanded</div>}
			/>,
		);

		// The expander header cell has no data-nav-row/col at all — it never appears in the grid.
		expect(container.querySelector('[data-nav-row="-1"][data-nav-col="1"]')).not.toBeInTheDocument();

		const expanderCell = container.querySelector<HTMLElement>('[data-nav-row="0"][data-nav-col="1"]')!;
		fireEvent.keyDown(expanderCell, { key: 'ArrowUp' });
		// Falls back to the nearest header cell instead of landing nowhere.
		const landed = document.activeElement as HTMLElement;
		expect(landed).not.toBe(document.body);
		expect(landed.closest('[data-nav-row]')?.getAttribute('data-nav-row')).toBe('-1');
	});

	test('focus ring spans the full header cell width, not just the inner sortable label', () => {
		const sortableColumns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
			{ id: 'age', name: 'Age', selector: r => r.age },
		];
		const { container } = render(<DataTable columns={sortableColumns} data={rows} cellNavigation />);

		fireEvent.keyDown(getCells(container)[0], { key: 'ArrowUp' });
		const outerHeaderCell = document.activeElement!.closest('[data-nav-row="-1"][data-nav-col="0"]') as HTMLElement;
		expect(outerHeaderCell).not.toBeNull();
		expect(outerHeaderCell.className).toContain('rdt_TableCol');
		// The focusable element is the inner sortable div, a descendant of the outer cell
		// that data-nav-row/col (and therefore the :focus-within ring) is attached to.
		expect(outerHeaderCell).not.toBe(document.activeElement);
		expect(outerHeaderCell.contains(document.activeElement)).toBe(true);
	});

	test('Home/End jump to row edges; Ctrl+Home/Ctrl+End jump to grid corners', () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.keyDown(cells[2], { key: 'End' }); // row 1
		expect(document.activeElement).toBe(cells[3]);

		fireEvent.keyDown(cells[3], { key: 'Home' });
		expect(document.activeElement).toBe(cells[2]);

		fireEvent.keyDown(cells[2], { key: 'End', ctrlKey: true });
		expect(document.activeElement).toBe(cells[5]); // last row, last column

		fireEvent.keyDown(cells[5], { key: 'Home', ctrlKey: true });
		expect(document.activeElement).toBe(cells[0]);
	});

	test('Enter and F2 open the editor on the focused editable cell', async () => {
		const { container, unmount } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		fireEvent.keyDown(getCells(container)[0], { key: 'Enter' });
		expect(await screen.findByDisplayValue('Alice')).toBeInTheDocument();
		unmount();

		const second = render(<DataTable columns={columns} data={rows} cellNavigation />);
		fireEvent.keyDown(getCells(second.container)[0], { key: 'F2' });
		expect(await second.findByDisplayValue('Alice')).toBeInTheDocument();
	});

	test('Enter on a cell does not trigger row click handlers', () => {
		const onRowClicked = vi.fn();
		const { container } = render(
			<DataTable columns={columns} data={rows} cellNavigation onRowClicked={onRowClicked} />,
		);
		fireEvent.keyDown(getCells(container)[1], { key: 'Enter' }); // non-editable cell
		expect(onRowClicked).not.toHaveBeenCalled();
	});

	test('arrow keys do not navigate cells while the focused cell is being edited', async () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.focus(cells[0]);
		fireEvent.keyDown(cells[0], { key: 'Enter' });
		const input = await screen.findByDisplayValue('Alice');

		fireEvent.keyDown(input, { key: 'ArrowRight' });
		// Still editing "name" on row 0 — focus has not been moved to another cell.
		expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
	});

	test('Escape cancels editing and returns focus to the cell for further navigation', async () => {
		const { container } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.focus(cells[0]);
		fireEvent.keyDown(cells[0], { key: 'Enter' });
		const input = await screen.findByDisplayValue('Alice');
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(screen.queryByDisplayValue('Alice')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(cells[0]);

		// Navigation resumes normally after cancelling.
		fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(getCells(container)[1]);
	});

	test('keeps a Tab stop when the active row disappears from the page', () => {
		const { container, rerender } = render(<DataTable columns={columns} data={rows} cellNavigation />);
		const cells = getCells(container);

		fireEvent.focus(cells[5]); // row 2, "age"
		expect(cells[5].getAttribute('tabindex')).toBe('0');

		rerender(<DataTable columns={columns} data={[rows[0]]} cellNavigation />);
		const remaining = getCells(container);
		expect(remaining).toHaveLength(2);
		// Active cell clamps to the last row; the "age" column stays active.
		expect(remaining[1].getAttribute('tabindex')).toBe('0');
	});

	test('omitted columns are excluded from the nav grid', () => {
		const withOmit: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name },
			{ id: 'hidden', name: 'Hidden', selector: r => r.id, omit: true },
			{ id: 'age', name: 'Age', selector: r => r.age },
		];
		const { container } = render(<DataTable columns={withOmit} data={rows} cellNavigation />);
		const cells = getCells(container);
		expect(cells).toHaveLength(6);

		fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(cells[1]); // "age", not the omitted column
		expect(cells[1].getAttribute('data-nav-col')).toBe('1');
	});

	test('two tables with identical column ids and row keys do not steal focus from each other after editing', async () => {
		// Each cell's `id` prop is `column.id` + row keyField with no per-table prefix, so
		// two tables with the same columns/data produce identical DOM ids. Refocus-after-edit
		// is ref-based (not an id lookup), so it stays scoped to the cell it belongs to.
		function TwoTables() {
			return (
				<div>
					<div data-testid="table-a">
						<DataTable columns={columns} data={rows} cellNavigation />
					</div>
					<div data-testid="table-b">
						<DataTable columns={columns} data={rows} cellNavigation />
					</div>
				</div>
			);
		}
		render(<TwoTables />);

		const tableA = screen.getByTestId('table-a');
		const tableB = screen.getByTestId('table-b');
		const cellsA = getCells(tableA);
		const cellsB = getCells(tableB);

		fireEvent.focus(cellsA[0]);
		fireEvent.keyDown(cellsA[0], { key: 'Enter' });
		const input = await screen.findAllByDisplayValue('Alice').then(inputs => inputs[0]);
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(document.activeElement).toBe(cellsA[0]);
		expect(tableB.contains(document.activeElement)).toBe(false);
		expect(cellsB[0].getAttribute('tabindex')).toBe('0');
	});
});
