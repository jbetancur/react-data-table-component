import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useCellNavigation, getPinnedOffsets, getPinnedCellMeta } from '../index';
import type { TableColumn } from '../types';

interface Row {
	id: number;
	name: string;
	age: number;
}

const rows: Row[] = [
	{ id: 1, name: 'Alice', age: 30 },
	{ id: 2, name: 'Bob', age: 40 },
];

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name },
	{ id: 'age', name: 'Age', selector: r => r.age },
];

// Custom markup: a plain <table>, no <DataTable /> anywhere. Proves useCellNavigation
// works standalone off data-nav-row/data-nav-col attributes alone.
function CustomTable() {
	const { activeCell, handleNavFocus, handleNavKeyDown } = useCellNavigation({
		cellNavigation: true,
		selectableRows: false,
		expandableRows: false,
		expandableRowsHideExpander: false,
		effectiveColumns: columns,
		filteredTableRowCount: rows.length,
		showTableHead: false,
	});

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<table onFocus={handleNavFocus} onKeyDown={handleNavKeyDown}>
			<tbody>
				{rows.map((row, rowIndex) => (
					<tr key={row.id}>
						{columns.map((col, colIndex) => {
							const active = activeCell?.row === rowIndex && activeCell?.col === colIndex;
							return (
								<td key={col.id} data-nav-row={rowIndex} data-nav-col={colIndex} tabIndex={active ? 0 : -1}>
									{col.selector?.(row, rowIndex)}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}

describe('headless useCellNavigation', () => {
	test('moves focus across a hand-rolled <table> with no DataTable involved', () => {
		const { container } = render(<CustomTable />);
		const cells = Array.from(container.querySelectorAll<HTMLElement>('td'));

		fireEvent.focus(cells[0]);
		fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
		expect(document.activeElement).toBe(cells[1]);

		fireEvent.keyDown(cells[1], { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cells[3]);
	});
});

describe('headless pinning utils', () => {
	test('getPinnedOffsets and getPinnedCellMeta compute sticky metadata with no component tree', () => {
		const pinnedColumns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, pinned: 'left' },
			{ id: 'age', name: 'Age', selector: r => r.age },
		];
		const widths = { name: 120, age: 80 };

		const offsets = getPinnedOffsets(pinnedColumns, widths, false, false, false);
		expect(offsets.left.name).toBe(0);

		const meta = getPinnedCellMeta(pinnedColumns[0], offsets, 1);
		expect(meta.style.position).toBe('sticky');
	});
});
