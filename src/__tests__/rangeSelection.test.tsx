import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DataTable from '../components/DataTable';
import type { TableColumn } from '../types';

type Row = { id: number; name: string; status: 'Active' | 'On Leave' };

const data: Row[] = [
	{ id: 1, name: 'Aria', status: 'Active' },
	{ id: 2, name: 'Bo', status: 'Active' },
	{ id: 3, name: 'Cole', status: 'On Leave' },
	{ id: 4, name: 'Dee', status: 'Active' },
	{ id: 5, name: 'Eli', status: 'Active' },
];

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name },
	{ id: 'status', name: 'Status', selector: r => r.status },
];

function rowCheckboxes(container: HTMLElement): HTMLInputElement[] {
	// First checkbox is the header "select all"; rows follow.
	return Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).slice(1);
}

describe('range selection', () => {
	test('Shift-click selects every row between the anchor and the target', () => {
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const boxes = rowCheckboxes(container);
		fireEvent.click(boxes[0]); // anchor on row 1
		fireEvent.click(boxes[3], { shiftKey: true }); // extend to row 4

		const calls = onSelectedRowsChange.mock.calls;
		const lastCall = calls[calls.length - 1]?.[0];
		expect(lastCall.selectedCount).toBe(4);
		expect(lastCall.selectedRows.map((r: Row) => r.id).sort()).toEqual([1, 2, 3, 4]);
	});

	test('Shift-click without an anchor falls back to a single toggle', () => {
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const boxes = rowCheckboxes(container);
		fireEvent.click(boxes[2], { shiftKey: true });

		const calls = onSelectedRowsChange.mock.calls;
		const lastCall = calls[calls.length - 1]?.[0];
		expect(lastCall.selectedCount).toBe(1);
		expect(lastCall.selectedRows[0].id).toBe(3);
	});

	test('Shift-click in single-select mode does not extend the range', () => {
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectableRowsSingle
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const boxes = rowCheckboxes(container);
		fireEvent.click(boxes[0]);
		fireEvent.click(boxes[3], { shiftKey: true });

		const calls = onSelectedRowsChange.mock.calls;
		const lastCall = calls[calls.length - 1]?.[0];
		expect(lastCall.selectedCount).toBe(1);
	});

	test('selectableRowsRange={false} disables Shift-click range', () => {
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectableRowsRange={false}
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const boxes = rowCheckboxes(container);
		fireEvent.click(boxes[0]);
		fireEvent.click(boxes[3], { shiftKey: true });

		const calls = onSelectedRowsChange.mock.calls;
		const lastCall = calls[calls.length - 1]?.[0];
		expect(lastCall.selectedCount).toBe(2); // two toggles, no range
	});

	test('Shift-click skips disabled rows in the range', () => {
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectableRowDisabled={r => r.status === 'On Leave'}
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const boxes = rowCheckboxes(container);
		fireEvent.click(boxes[0]); // anchor on row 1
		fireEvent.click(boxes[3], { shiftKey: true }); // extend through Cole (disabled) to Dee

		const calls = onSelectedRowsChange.mock.calls;
		const lastCall = calls[calls.length - 1]?.[0];
		const ids = lastCall.selectedRows.map((r: Row) => r.id).sort();
		expect(ids).toEqual([1, 2, 4]); // row 3 (Cole) excluded
	});
});

describe('controlled selection', () => {
	test('controlled selectedRows drives the rendered checked state', () => {
		const onSelectedRowsChange = vi.fn();
		const { container, rerender } = render(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectedRows={[data[0]]}
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		let boxes = rowCheckboxes(container);
		expect(boxes[0].checked).toBe(true);
		expect(boxes[1].checked).toBe(false);

		rerender(
			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectedRows={[data[1], data[2]]}
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		boxes = rowCheckboxes(container);
		expect(boxes[0].checked).toBe(false);
		expect(boxes[1].checked).toBe(true);
		expect(boxes[2].checked).toBe(true);
	});
});
