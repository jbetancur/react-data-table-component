import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import DataTable from '../components/DataTable';
import { Direction, STOP_PROP_TAG } from '../constants';
import { Alignment } from '../index';
import { ConditionalStyles, SortOrder, DataTableHandle } from '../types';

interface Data {
	id: number;
	defaultExpanded?: boolean;
	disabled?: boolean;
	selected?: boolean;
	completed?: boolean;
	isSpecial?: boolean;
	some: {
		name: string;
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataMock = (colProps?: any) => {
	return {
		columns: [{ name: 'Test', selector: (row: { name: string }[]) => row.some.name, ...colProps }],
		data: [
			{
				id: 1,
				some: { name: 'Apple' },
				disabled: false,
				selected: false,
				completed: false,
				isSpecial: false,
				defaultExpanded: false,
			},
			{
				id: 2,
				some: { name: 'Zuchinni' },
				disabled: false,
				selected: false,
				completed: false,
				isSpecial: false,
				defaultExpanded: false,
			},
		],
	};
};

beforeEach(() => {
	console.error = vi.fn();
});

test('should render and empty table correctly', () => {
	const { container } = render(<DataTable data={[]} columns={[]} />);

	expect(container.querySelector('[role="table"]')).not.toBeNull();
});

test('should render the correctly when using selector function', () => {
	type TestData = {
		id: number;
		name: string;
	};

	const data: TestData[] = [{ id: 1, name: 'Leia' }];
	const columns = [{ name: 'Name', selector: (row: TestData) => row.name }];
	const { getByText } = render(<DataTable data={data} columns={columns} />);

	expect(getByText('Leia')).not.toBeNull();
});

test('should render the correctly when using selector function and a format function', () => {
	type TestData = {
		id: number;
		name: string;
	};

	const columns = [
		{ name: 'Name', selector: (row: TestData) => row.name, format: (row: TestData) => row.name.slice(0, 2) },
	];
	const data = [{ id: 1, name: 'Leia' }];
	const { getByText } = render(<DataTable data={data} columns={columns} />);

	expect(getByText('Le')).not.toBeNull();
});

test('should render correctly if the keyField is overridden', () => {
	const mock = dataMock();
	const data = [{ uuid: 123, some: { name: 'Henry the 8th' } }];
	const { container } = render(<DataTable data={data} columns={mock.columns} keyField="uuid" />);

	expect(container.querySelector('div[id="row-123"]')).not.toBeNull();
});

test('should fallback to array indexes if data has no unique key', () => {
	const mock = dataMock();
	const data = [{ some: { name: 'Henry the 8th' } }];
	const { container } = render(<DataTable data={data} columns={mock.columns} />);

	expect(container.querySelector('div[id="row-0"]')).not.toBeNull();
});

test('should render correctly when disabled', () => {
	const mock = dataMock();
	const { container } = render(<DataTable data={mock.data} columns={mock.columns} disabled />);

	expect(container.querySelector('.rdt_tableDisabled')).not.toBeNull();
});

test('should not show the TableHead when noTableHead is true', () => {
	const mock = dataMock();
	const { container } = render(<DataTable data={mock.data} columns={mock.columns} noTableHead />);

	expect(container.querySelector('.rdt_TableHead')).toBeNull();
});

describe('DataTable::onSelectedRowsChange', () => {
	test('should call onSelectedRowsChange with the correct values when select all rows is selected', () => {
		const mock = dataMock();
		const updatedMock = vi.fn();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows onSelectedRowsChange={updatedMock} />,
		);

		fireEvent.click(container.querySelector('input[name="Select all rows"]') as HTMLInputElement);

		expect(updatedMock).toBeCalledWith({
			allSelected: true,
			selectedCount: 2,
			selectedRows: mock.data,
		});
	});

	test('should call onSelectedRowsChange with the correct values when all rows are selected', () => {
		const mock = dataMock();
		const updatedMock = vi.fn();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows onSelectedRowsChange={updatedMock} />,
		);

		fireEvent.click(container.querySelector('input[name="Select row 2"]') as HTMLInputElement);
		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);

		expect(updatedMock).toBeCalledWith({
			allSelected: true,
			selectedCount: 2,
			selectedRows: mock.data,
		});
	});

	test('should call onSelectedRowsChange with the correct values when a row is selected', () => {
		const mock = dataMock();
		const updatedMock = vi.fn();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows onSelectedRowsChange={updatedMock} />,
		);

		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);

		expect(updatedMock).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [mock.data[0]],
		});
	});

	test('should call onSelectedRowsChange with the correct values when a row is selected when selectableRowsSingle is true', () => {
		const onSelectedRowsChange = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				selectableRows
				selectableRowsSingle
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;

		fireEvent.click(rowCheck1);

		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [
				{
					id: 1,
					some: {
						name: 'Apple',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: false,
				},
			],
		});

		fireEvent.click(rowCheck2);

		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [
				{
					id: 2,
					some: {
						name: 'Zuchinni',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: false,
				},
			],
		});
	});

	test('should call onSelectedRowsChange when a row is preselected using selectableRowSelected', () => {
		const mock = dataMock();
		mock.data[0].selected = true;

		const onSelectedRowsChange = vi.fn();

		render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				selectableRows
				selectableRowSelected={row => row.selected}
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [
				{
					id: 1,
					some: {
						name: 'Apple',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: true,
				},
			],
		});
	});
});

describe('data prop changes', () => {
	test('should update state if the data prop changes', () => {
		const mock = dataMock();
		const { container, rerender } = render(<DataTable data={mock.data} columns={mock.columns} />);

		rerender(<DataTable data={[{ id: 1, some: { name: 'Someone else' } }]} columns={mock.columns} />);

		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
		expect(container.querySelector('div[id="row-2"]')).toBeNull();
	});
});

describe('DataTable::columns', () => {
	test('should render correctly with columns/data', () => {
		const mock = dataMock();
		const { getByText } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(getByText('Apple')).not.toBeNull();
		expect(getByText('Zuchinni')).not.toBeNull();
		expect(getByText('Test')).not.toBeNull();
	});

	test('should render correctly when column.sortable = true', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_columnSortableEnabled')).not.toBeNull();
	});

	test('should render correctly when column.wrap = true', () => {
		const mock = dataMock({ wrap: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		const innerDiv = cell?.querySelector('div[data-tag="allowRowEvents"]') as HTMLElement;
		expect(innerDiv?.style.whiteSpace).toBe('normal');
	});

	test('should render correctly when column.allowOverflow = true', () => {
		const mock = dataMock({ allowOverflow: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		const innerDiv = cell?.querySelector('div[data-tag="allowRowEvents"]') as HTMLElement;
		expect(innerDiv?.style.overflow).toBe('visible');
	});

	test('should render correctly when column.compact = true', () => {
		const mock = dataMock({ compact: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.padding).toBe('0px');
	});

	test('should render correctly when column.button = true', () => {
		const mock = dataMock({ button: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.padding).toBe('0px');
	});

	test('should render correctly when ignoreRowClick = true', () => {
		const mock = dataMock({ ignoreRowClick: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.getAttribute('data-tag')).toBeNull();
	});

	test('should render correctly when column.cell is set to a component', () => {
		const mock = dataMock({ cell: (row: { some: { name: string } }) => <div>{row.some.name}</div> });
		const { getByText } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(getByText('Apple')).not.toBeNull();
	});

	test('should render correctly if column.right', () => {
		const mock = dataMock({ right: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.justifyContent).toBe('flex-end');
	});

	test('should render correctly if column.center', () => {
		const mock = dataMock({ center: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.justifyContent).toBe('center');
	});

	test('should render correctly if column.minWidth', () => {
		const mock = dataMock({ minWidth: '200px' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.minWidth).toBe('200px');
	});

	test('should render correctly if column.maxWidth', () => {
		const mock = dataMock({ maxWidth: '600px' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.maxWidth).toBe('600px');
	});

	test('should render correctly if column.width', () => {
		const mock = dataMock({ width: '200px' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell?.style.maxWidth).toBe('200px');
		expect(cell?.style.minWidth).toBe('200px');
	});

	test('should render correctly if column.hide sm', () => {
		const mock = dataMock({ hide: 'sm' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_hideOnSm')).not.toBeNull();
	});

	test('should render correctly if column.hide md', () => {
		const mock = dataMock({ hide: 'md' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_hideOnMd')).not.toBeNull();
	});

	test('should render correctly if column.hide lg', () => {
		const mock = dataMock({ hide: 'lg' });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_hideOnLg')).not.toBeNull();
	});

	test('should render correctly if column.omit is true', () => {
		const mock = dataMock();
		const mockColumns = mock.columns.slice();
		mockColumns.push({ id: 2, name: 'HideMe', selector: 'some.name', omit: true });

		const { container } = render(<DataTable data={mock.data} columns={mockColumns} />);

		expect(container.querySelector('div[data-column-id="2"]')).toBeNull();
	});
});

describe('DataTable:RowClicks', () => {
	test('should not call onRowClicked when ignoreRowClick = true', () => {
		const onRowClickedMock = vi.fn();
		const mock = dataMock({ ignoreRowClick: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onRowClicked={onRowClickedMock} />);

		fireEvent.click(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowClickedMock).not.toBeCalled();
	});

	test('should not call onRowClicked when button = true', () => {
		const onRowClickedMock = vi.fn();
		const mock = dataMock({ button: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onRowClicked={onRowClickedMock} />);

		fireEvent.click(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowClickedMock).not.toBeCalled();
	});

	test('should not call onRowDoubleClicked when ignoreRowClick = true', () => {
		const onRowDoubleClickedMock = vi.fn();
		const mock = dataMock({ ignoreRowClick: true });
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} onRowDoubleClicked={onRowDoubleClickedMock} />,
		);

		fireEvent.click(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowDoubleClickedMock).not.toBeCalled();
	});

	test('should not call onRowDoubleClicked when button = true', () => {
		const onRowDoubleClickedMock = vi.fn();
		const mock = dataMock({ button: true });
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} onRowDoubleClicked={onRowDoubleClickedMock} />,
		);

		fireEvent.click(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowDoubleClickedMock).not.toBeCalled();
	});

	test('should call onRowMiddleClicked when a row is aux-clicked', () => {
		const onRowMiddleClickedMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} onRowMiddleClicked={onRowMiddleClickedMock} />,
		);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		fireEvent(cell, new MouseEvent('auxclick', { bubbles: true, cancelable: true }));
		expect(onRowMiddleClickedMock).toHaveBeenCalled();
	});
});

describe('DataTable:RowMouseEnterAndLeave', () => {
	test('should call onRowMouseEnter and onRowMouseLeave callbacks when row is entered/left', () => {
		const onRowMouseEnterMock = vi.fn();
		const onRowMouseLeaveMock = vi.fn();
		const mock = dataMock({});
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onRowMouseEnter={onRowMouseEnterMock}
				onRowMouseLeave={onRowMouseLeaveMock}
			/>,
		);

		fireEvent.mouseEnter(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowMouseEnterMock).toHaveBeenCalled();
		fireEvent.mouseLeave(container.querySelector('div[id="cell-1-1"]') as HTMLElement);
		expect(onRowMouseLeaveMock).toHaveBeenCalled();
	});

	test('should call onScroll when the responsive wrapper is scrolled', () => {
		const onScrollMock = vi.fn();
		const mock = dataMock({});
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onScroll={onScrollMock} />);

		fireEvent.scroll(container.querySelector('.rdt_responsiveWrapper') as HTMLElement);
		expect(onScrollMock).toHaveBeenCalledTimes(1);
	});

	test('should call onScroll when fixedHeader is enabled', () => {
		const onScrollMock = vi.fn();
		const mock = dataMock({});
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} fixedHeader onScroll={onScrollMock} />,
		);

		fireEvent.scroll(container.querySelector('.rdt_responsiveWrapperFixed') as HTMLElement);
		expect(onScrollMock).toHaveBeenCalledTimes(1);
	});
});

describe('DataTable::progress/nodata', () => {
	test('should overlay the body with the progress component when progressPending is true and data is present', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} progressPending />);

		expect(container.querySelector('.rdt_bodyOverlay')).not.toBeNull();
		// When there is data, the table (and header) stay mounted; the spinner overlays the body.
		expect(container.querySelector('.rdt_TableHead')).not.toBeNull();
	});

	test('should overlay the body when progressPending toggles to true', () => {
		const mock = dataMock();
		const { rerender, container } = render(
			<DataTable data={mock.data} columns={mock.columns} progressPending={false} />,
		);

		rerender(<DataTable data={mock.data} columns={mock.columns} progressPending />);

		expect(container.querySelector('.rdt_bodyOverlay')).not.toBeNull();
		expect(container.querySelector('.rdt_TableHead')).not.toBeNull();
	});

	test('should render skeleton rows when progressPending is true and there is no data', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={[]} columns={mock.columns} progressPending />);

		expect(container.querySelector('.rdt_skeletonPulse')).not.toBeNull();
	});

	test('should skip skeleton rows on initial load when progressSkeleton is false', () => {
		const mock = dataMock();
		const { container, getByText } = render(
			<DataTable
				data={[]}
				columns={mock.columns}
				progressPending
				progressSkeleton={false}
				progressComponent={<div>Loading…</div>}
			/>,
		);

		expect(container.querySelector('.rdt_skeletonPulse')).toBeNull();
		expect(getByText('Loading…')).not.toBeNull();
	});

	test('should still render skeleton rows when a custom progressComponent is passed but progressSkeleton is left default', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={[]} columns={mock.columns} progressPending progressComponent={<div>Loading…</div>} />,
		);

		expect(container.querySelector('.rdt_skeletonPulse')).not.toBeNull();
	});

	describe('when persistTableHead', () => {
		test('should render the progress component and keep TableHead when progressPending toggles to true', () => {
			const mock = dataMock();
			const { rerender, container } = render(
				<DataTable data={mock.data} columns={mock.columns} progressPending={false} persistTableHead />,
			);

			rerender(<DataTable data={mock.data} columns={mock.columns} progressPending persistTableHead />);

			expect(container.querySelector('.rdt_bodyOverlay')).not.toBeNull();
			expect(container.querySelector('.rdt_TableHead')).not.toBeNull();
		});

		test('should disable TableHead if no data', () => {
			const mock = dataMock();
			const { container } = render(<DataTable data={[]} columns={mock.columns} persistTableHead />);

			expect(container.querySelector('.rdt_TableHead')).not.toBeNull();
		});

		test('should disable TableHead if progressPending', () => {
			const mock = dataMock();
			const { container } = render(<DataTable data={[]} columns={mock.columns} persistTableHead progressPending />);

			expect(container.querySelector('.rdt_TableHead')).not.toBeNull();
		});
	});

	describe('when noTableHead', () => {
		test('should render the progress component without TableHead when progressPending toggles to true', () => {
			const mock = dataMock();
			const { rerender, container } = render(
				<DataTable data={mock.data} columns={mock.columns} progressPending={false} persistTableHead noTableHead />,
			);

			rerender(<DataTable data={mock.data} columns={mock.columns} progressPending persistTableHead noTableHead />);

			expect(container.querySelector('.rdt_bodyOverlay')).not.toBeNull();
			expect(container.querySelector('.rdt_TableHead')).toBeNull();
		});
	});

	test('should render correctly when progressPending is false and there are no row items', () => {
		const mock = dataMock();
		const { getByText } = render(<DataTable data={[]} columns={mock.columns} />);

		expect(getByText('There are no records to display')).toBeDefined();
	});

	test('should render correctly when a component is passed that is a string', () => {
		const mock = dataMock();
		const { getByText } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				progressPending
				progressComponent="A Component that is passed in"
			/>,
		);

		expect(getByText('A Component that is passed in')).not.toBeNull();
	});

	test('should render correctly when a component is passed that is a react component', () => {
		const mock = dataMock();
		const { getByText } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				progressPending
				progressComponent={<div>A String that is passed in</div>}
			/>,
		);

		expect(getByText('A String that is passed in')).not.toBeNull();
	});
});

describe('DataTable::responsive', () => {
	test('should render correctly responsive by default', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_responsiveWrapperScroll')).not.toBeNull();
	});

	test('should render correctly when responsive=false', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} responsive={false} />);

		expect(container.querySelector('.rdt_responsiveWrapperScroll')).toBeNull();
	});

	test('fixedHeader still creates a scroll container when responsive=false', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} responsive={false} fixedHeader />);

		expect(container.querySelector('.rdt_responsiveWrapperFixed')).not.toBeNull();
	});
});

describe('DataTable::sorting', () => {
	test('should not call onSort if the column is not sortable', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: false });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onSort={onSortMock} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		expect(onSortMock).not.toBeCalled();
	});

	test('should render correctly with a default sort field and the native sort icon', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_columnSortableEnabled')).not.toBeNull();
	});

	test('should render correctly with a default sort field and the icon to the right when column.right = true and the native sort icon', () => {
		const mock = dataMock({ sortable: true, right: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_columnSortableEnabled')).not.toBeNull();
	});

	test('should render correctly and not be sorted when a column.sort === false', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		// Non-sortable column: row order unchanged
		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
	});

	test('should render correctly when a column is sorted in default asc', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-1'); // Apple first in asc
	});

	test('should render correctly when a column is sorted from asc to desc', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		// click to select + sort asc
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		// click to sort desc
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-2'); // Zuchinni first in desc
	});

	test('a custom column sorting function is used', () => {
		const mock = dataMock({ sortFunction: (a: { id: number }, b: { id: number }) => a.id - b.id });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		// click to select + sort asc by id (1, 2)
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		// click to sort desc by id
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-2'); // id=2 first in desc by id
	});

	test('should sort if the column is selected and the Enter key is pressed', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		// select the column to sort
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		// press enter
		fireEvent.keyDown(container.querySelector('div[data-sort-id="1"]') as HTMLElement, { key: 'Enter' });

		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-2'); // asc then enter = desc, Zuchinni first
	});

	test('should call onSort with the correct params', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onSort={onSortMock} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		const sortedColumn = { id: 1, ...mock.columns[0] };
		expect(onSortMock).toBeCalledWith(sortedColumn, SortOrder.ASC, mock.data.slice(0).sort(), [
			{ column: sortedColumn, sortDirection: SortOrder.ASC },
		]);
	});

	test('should call onSort with the correct params if the sort is clicked twice', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onSort={onSortMock} />);

		const sortedColumn = { id: 1, ...mock.columns[0] };

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		expect(onSortMock).toBeCalledWith(sortedColumn, SortOrder.ASC, mock.data.slice(0).sort(), [
			{ column: sortedColumn, sortDirection: SortOrder.ASC },
		]);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		expect(onSortMock).toBeCalledWith(sortedColumn, SortOrder.DESC, mock.data.slice(0).reverse(), [
			{ column: sortedColumn, sortDirection: SortOrder.DESC },
		]);
	});

	test('a third plain click removes sorting and restores the original row order', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} onSort={onSortMock} />);

		const target = () => container.querySelector('div[data-sort-id="1"]') as HTMLElement;

		fireEvent.click(target()); // asc
		fireEvent.click(target()); // desc
		fireEvent.click(target()); // removed

		const lastCall = onSortMock.mock.calls[onSortMock.mock.calls.length - 1];
		expect(lastCall[0]).toEqual({});
		expect(lastCall[3]).toEqual([]);
		expect(target().getAttribute('aria-sort')).toBe('none');
	});

	test('Ctrl+click adds a second sort column when sortMulti is enabled', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: true });
		const columns = [mock.columns[0], { ...mock.columns[0], id: 2, name: 'Second', sortable: true }];
		const { container } = render(<DataTable data={mock.data} columns={columns} sortMulti onSort={onSortMock} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		fireEvent.click(container.querySelector('div[data-sort-id="2"]') as HTMLElement, { ctrlKey: true });

		const lastCall = onSortMock.mock.calls[onSortMock.mock.calls.length - 1];
		const sortColumns = lastCall[3];
		expect(sortColumns).toHaveLength(2);
		expect(sortColumns[0].column.id).toBe(1);
		expect(sortColumns[1].column.id).toBe(2);
	});

	test('Ctrl+click is ignored (treated as a replace) when sortMulti is disabled', () => {
		const onSortMock = vi.fn();
		const mock = dataMock({ sortable: true });
		const columns = [mock.columns[0], { ...mock.columns[0], id: 2, name: 'Second', sortable: true }];
		const { container } = render(<DataTable data={mock.data} columns={columns} onSort={onSortMock} />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		fireEvent.click(container.querySelector('div[data-sort-id="2"]') as HTMLElement, { ctrlKey: true });

		const lastCall = onSortMock.mock.calls[onSortMock.mock.calls.length - 1];
		expect(lastCall[3]).toHaveLength(1);
		expect(lastCall[3][0].column.id).toBe(2);
	});

	test('should render correctly with a custom sortIcon', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} sortIcon={<div>ASC</div>} />);

		expect(container.querySelector('.__rdt_custom_sort_icon__')).not.toBeNull();
	});

	test('should render correctly with a custom sortIcon and column.right = true', () => {
		const mock = dataMock({ sortable: true, right: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} sortIcon={<div>ASC</div>} />);

		expect(container.querySelector('.__rdt_custom_sort_icon__')).not.toBeNull();
	});

	test('should render correctly with a defaultSortAsc = false', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} defaultSortAsc={false} />);

		// With defaultSortAsc=false, clicking sort goes desc first
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-2'); // Zuchinni first in desc
	});

	test('should render correctly and bypass internal sort when sortServer = true and asc sort', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} sortServer />);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		// Row order unchanged with sortServer: Apple still first
		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-1');
	});

	test('should render correctly and bypass internal sort when sortServer = true and desc sort', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} sortServer defaultSortFieldId={1} />,
		);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		// Row order still unchanged with sortServer
		const rows = container.querySelectorAll('.rdt_row');
		expect(rows[0].id).toBe('row-1');
	});

	test('ref.clearSort resets row order back to defaultSortFieldId asc', () => {
		const columns = [{ id: 'name', name: 'Test', selector: (row: Data) => row.some.name, sortable: true }];
		const ref = React.createRef<DataTableHandle>();
		const { container } = render(
			<DataTable ref={ref} data={dataMock().data} columns={columns} defaultSortFieldId="name" defaultSortAsc />,
		);

		// column already active asc; one click flips to desc — Zuchinni (row-2) first
		fireEvent.click(container.querySelector('div[data-sort-id="name"]') as HTMLElement);
		expect(container.querySelectorAll('.rdt_row')[0].id).toBe('row-2');

		// reset — back to defaultSortAsc=true so Apple (row-1) first
		act(() => {
			ref.current?.clearSort();
		});
		expect(container.querySelectorAll('.rdt_row')[0].id).toBe('row-1');
	});
});

describe('DataTable::expandableRows', () => {
	test('should render correctly when expandableRows is true', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} expandableRows />);

		expect(container.querySelector('[data-testid="expander-button-1"]')).not.toBeNull();
	});

	test('should render correctly when expandableRowsHideExpander is true', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows expandableRowsHideExpander />,
		);

		expect(container.querySelector('[data-testid="expander-button-1"]')).toBeNull();
	});

	test('should not render expandableRows expandableRows is missing', () => {
		const mock = dataMock();
		mock.data[0].defaultExpanded = true;
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRowExpanded={row => row.defaultExpanded} />,
		);

		expect(container.querySelector('[data-testid="expander-button-1"]')).toBeNull();
	});

	test('should render correctly when expandableRows is true and the row is toggled', () => {
		const mock = dataMock();
		const { container, getByTestId } = render(<DataTable data={mock.data} columns={mock.columns} expandableRows />);

		fireEvent.click(getByTestId('expander-button-1'));

		expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
	});

	test('should render correctly when expandableRowExpanded is true', () => {
		const mock = dataMock();
		mock.data[0].defaultExpanded = true;
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandableRowExpanded={row => row.defaultExpanded}
			/>,
		);

		expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
	});

	test('should render correctly when expandableRowExpanded changes on render', () => {
		const mock = dataMock();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandableRowExpanded={row => row.defaultExpanded}
			/>,
		);

		// expand all rows
		const expandedData = mock.data.slice().map(i => ({ ...i, defaultExpanded: !i.defaultExpanded }));

		rerender(
			<DataTable
				data={expandedData}
				columns={mock.columns}
				expandableRows
				expandableRowExpanded={row => row.defaultExpanded}
			/>,
		);

		expect(container.querySelectorAll('.rdt_ExpanderRow')).toHaveLength(2);
	});

	test('should not expand a row if the expander row is disabled', () => {
		const mock = dataMock();
		mock.data[0].disabled = true;
		const { container, getByTestId } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows expandableRowDisabled={row => row.disabled} />,
		);
		fireEvent.click(getByTestId('expander-button-1'));

		expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
	});

	test('should not expand a row if expandableRows is false and expandOnRowClicked is true ', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} expandOnRowClicked />);

		fireEvent.click(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
	});

	test('should expand a row if expandableRows is true and expandOnRowClicked is true', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows expandOnRowClicked />,
		);

		fireEvent.click(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
	});

	test('should not expand a row if expandableRows is false and expandOnRowDoubleClicked is true ', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} expandOnRowDoubleClicked />);

		fireEvent.click(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
	});

	test('should expand a row if expandableRows is true and expandOnRowDoubleClicked is true', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows expandOnRowDoubleClicked />,
		);

		fireEvent.doubleClick(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(container.querySelector('.rdt_ExpanderRow')).not.toBe(null);
	});

	test('should not expand a row if the expander row is disabled and expandOnRowClicked is true', () => {
		const mock = dataMock();
		mock.data[0].disabled = true;
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandOnRowClicked
				expandableRowDisabled={row => row.disabled}
			/>,
		);

		fireEvent.click(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(container.querySelector('.rdt_ExpanderRow')).toBe(null);
	});

	test('should call onRowExpandToggled with the correct values if a row is expanded', () => {
		const onRowExpandToggledMock = vi.fn();
		const mock = dataMock();
		const { getByTestId } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows onRowExpandToggled={onRowExpandToggledMock} />,
		);

		fireEvent.click(getByTestId('expander-button-1'));
		expect(onRowExpandToggledMock).toBeCalledWith(true, mock.data[0]);
	});

	test('should call onRowExpandToggled with the correct values if a row is collapsed', () => {
		const onRowExpandToggledMock = vi.fn();
		const mock = dataMock();
		const { getByTestId } = render(
			<DataTable data={mock.data} columns={mock.columns} expandableRows onRowExpandToggled={onRowExpandToggledMock} />,
		);

		fireEvent.click(getByTestId('expander-button-1'));
		fireEvent.click(getByTestId('expander-button-1'));
		expect(onRowExpandToggledMock).toBeCalledWith(false, mock.data[0]);
	});

	test('should call onRowExpandToggled if expandOnRowClicked', () => {
		const onRowExpandToggledMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandOnRowClicked
				onRowExpandToggled={onRowExpandToggledMock}
			/>,
		);

		fireEvent.click(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(onRowExpandToggledMock).toBeCalled();
	});

	test('should call onRowExpandToggled if expandOnRowDoubleClicked', () => {
		const onRowExpandToggledMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandOnRowDoubleClicked
				onRowExpandToggled={onRowExpandToggledMock}
			/>,
		);

		fireEvent.doubleClick(container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement);

		expect(onRowExpandToggledMock).toBeCalled();
	});

	test('should expand a row when Enter is pressed on the row and expandOnRowClicked is true', () => {
		const onRowExpandToggledMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				expandableRows
				expandOnRowClicked
				onRowExpandToggled={onRowExpandToggledMock}
			/>,
		);

		// Key events only count when the row itself is focused — bubbled keys from
		// focused descendants (editors, cell navigation) must not toggle the row.
		fireEvent.keyDown(container.querySelector('div[id^="row-"]') as HTMLElement, { key: 'Enter' });

		expect(onRowExpandToggledMock).toHaveBeenCalled();
	});
});

describe('DataTable::selectableRows', () => {
	test('should render correctly when selectableRows is true', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);

		expect(container.querySelector('input[name="Select all rows"]')).not.toBeNull();
		expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(3); // header + 2 rows
	});

	test('should render correctly when selectableRowsHighlight is true and a row is selected', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowsHighlight />,
		);

		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);

		expect(container.querySelector('.rdt_rowSelected')).not.toBeNull();
	});

	test('should only select a single row when using selectableRowsSingle and a row is selected', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowsSingle />,
		);

		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;

		fireEvent.click(rowCheck1);
		fireEvent.click(rowCheck2);

		expect(rowCheck1.checked).toBe(false);
		expect(rowCheck2.checked).toBe(true);
	});

	test('should de-select a single row when clicked again', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowsSingle />,
		);

		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;

		fireEvent.click(rowCheck);
		expect(rowCheck.checked).toBe(true);

		fireEvent.click(rowCheck);

		expect(rowCheck.checked).toBe(false);
	});

	test('should clear all rows selectableRowsSingle is changed', () => {
		const mock = dataMock();
		const { container, rerender } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;

		fireEvent.click(rowCheck1);
		fireEvent.click(rowCheck2);

		rerender(<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowsSingle />);

		expect(rowCheck1.checked).toBe(false);
		expect(rowCheck2.checked).toBe(false);
	});

	test('should not render a select all checkbox when selectableRowsNoSelectAll is true', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowsNoSelectAll />,
		);

		expect(container.querySelector('input[name="Select all rows"]')).toBe(null);
	});

	test('select-all-rows should be true is all rows are selected', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);

		expect(allCheck.checked).toBe(true);
	});

	test('select-all-rows should be false and not when all rows is de-selected', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);
		fireEvent.click(allCheck);

		expect(allCheck.checked).toBe(false);
	});

	test('should render correctly when selectableRows is true and a single row is checked', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(rowCheck);

		expect(rowCheck.checked).toBe(true);
		expect(allCheck.indeterminate).toBe(true);
	});

	test('select-all-rows should not be indeterminate when all rows are selected', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(rowCheck1);
		fireEvent.click(rowCheck2);

		expect(allCheck.indeterminate).toBe(false);
	});

	test('should only select the first row when using selectableRowsSingle and selectableRowSelected and a row is selected', () => {
		const mock = dataMock();

		mock.data[0].selected = true;
		mock.data[1].selected = true;

		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				selectableRows
				selectableRowsSingle
				selectableRowSelected={row => row.selected}
			/>,
		);

		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;

		expect(rowCheck1.checked).toBe(true);
		expect(rowCheck2.checked).toBe(false);
	});

	test('select-all-rows should be indeterminate when a single row is selected', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(rowCheck);

		expect(allCheck.indeterminate).toBe(true);
	});

	test('select-all-rows should be indeterminate when a row is selected ', () => {
		const mock = dataMock();

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowSelected={row => row.selected} />,
		);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(rowCheck);

		expect(allCheck.indeterminate).toBe(true);
	});

	test('should render correctly when selectableRows is true and a single row is un-checked', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;

		fireEvent.click(rowCheck);
		fireEvent.click(rowCheck);

		expect(rowCheck.checked).toBe(false);
	});

	test('select-all-rows should only check non disabled rows', () => {
		const mock = dataMock();
		mock.data[0].disabled = true;

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowDisabled={row => row.disabled} />,
		);

		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;
		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;

		fireEvent.click(allCheck);

		expect(rowCheck1.checked).toBe(false);
		expect(rowCheck2.checked).toBe(true);
	});

	test('should not be checked if the selectableRow is disabled', () => {
		const mock = dataMock();
		mock.data[0].disabled = true;

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowDisabled={row => row.disabled} />,
		);
		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;

		fireEvent.click(rowCheck1);
		fireEvent.click(rowCheck1);

		expect(rowCheck1.checked).toBe(false);
	});

	test('select-all-rows should be disabled if all rows are disabled', () => {
		const mock = dataMock();
		mock.data[0].disabled = true;
		mock.data[1].disabled = true;

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowDisabled={row => row.disabled} />,
		);
		const rowCheck1 = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const rowCheck2 = container.querySelector('input[name="Select row 2"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);

		expect(allCheck.checked).toBe(false);
		expect(rowCheck1.checked).toBe(false);
		expect(rowCheck2.checked).toBe(false);
	});

	test('should be checked if a row is pre-selected and select-all-rows should indeterminate if not all rows are selected', () => {
		const mock = dataMock();
		mock.data[0].selected = true;

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowSelected={row => row.selected} />,
		);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		expect(rowCheck.checked).toBe(true);
		expect(allCheck.indeterminate).toBe(true);
	});

	test('select-all-rows should be checked if the all rows are pre-selected but select-all-rows should not be indeterminate', () => {
		const mock = dataMock();
		mock.data[0].selected = true;
		mock.data[1].selected = true;

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows selectableRowSelected={row => row.selected} />,
		);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		expect(allCheck.checked).toBe(true);
		expect(allCheck.indeterminate).toBe(false);
	});

	test('should render correctly when clearSelectedRows is toggled', () => {
		const mock = dataMock();
		const { container, rerender } = render(<DataTable data={mock.data} columns={mock.columns} selectableRows />);
		const rowCheck = container.querySelector('input[name="Select row 1"]') as HTMLInputElement;

		fireEvent.click(rowCheck);

		rerender(<DataTable data={mock.data} columns={mock.columns} selectableRows clearSelectedRows />);

		expect(rowCheck.checked).toBe(false);
	});

	test('should call onRowClicked is provided', () => {
		const rowClickedMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} selectableRows onRowClicked={rowClickedMock} />,
		);

		const div = container.querySelector(`div[data-tag="${STOP_PROP_TAG}"]`) as HTMLElement;

		fireEvent.click(div);

		expect(rowClickedMock.mock.calls[0][0]).toEqual(mock.data[0]);
		expect(rowClickedMock.mock.calls[0][1]).toBeDefined(); // TODO: mock event?
	});

	test('should render correctly when selectableRows, selectableRowsVisibleOnly and pagination', () => {
		const mock = dataMock({ sortable: true });
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				selectableRowsVisibleOnly
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select all rows"]') as HTMLInputElement);

		// not ideal for testing but we can use the onSelectedRowsChange handler
		// to check that we only have 1 items selected (on page1) out of a total of 2
		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: true,
			selectedCount: 1,
			selectedRows: [
				{
					id: 1,
					some: {
						name: 'Apple',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: false,
				},
			],
		});
	});
});

describe('DataTable::Pagination', () => {
	test('should render correctly if pagination is enabled', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} pagination />);

		expect(container.querySelector('#pagination-first-page')).not.toBeNull();
		expect(container.querySelector('#pagination-last-page')).not.toBeNull();
	});

	test('should have the correct amount of rows when paging forward', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);

		expect(container.querySelector('div[id="row-1"]')).toBeNull();
		expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
	});

	test('should have the correct amount of rows when paging to the last page', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(container.querySelector('div[id="row-1"]')).toBeNull();
		expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
	});

	test('should have the correct amount of rows when paging backward to the first page', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationDefaultPage={2}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);

		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
		expect(container.querySelector('div[id="row-2"]')).toBeNull();
	});

	test('should navigate to page 1 if the table is sorted', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);

		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
	});

	test('should recalculate pagination position if there is only 1 item and it is removed from the data', () => {
		const mock = dataMock();
		const mockOneDeleted = dataMock().data.slice(0, 1);
		const onChangePageMock = vi.fn();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		// move to last page
		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);

		rerender(
			<DataTable
				data={mockOneDeleted}
				columns={mock.columns}
				onChangePage={onChangePageMock}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
			/>,
		);

		expect(onChangePageMock).toBeCalledWith(1, 1);
	});

	test('should change the page position when using paginationServer if the last item is removed from a page', () => {
		const mock = dataMock();
		const mockOneDeleted = dataMock().data.slice(0, 1);
		const onChangePageMock = vi.fn();
		const onChangeRowsPerPageMock = vi.fn();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onChangePage={onChangePageMock}
				paginationPerPage={1}
				paginationTotalRows={2}
				paginationRowsPerPageOptions={[1, 2]}
				onChangeRowsPerPage={onChangeRowsPerPageMock}
				paginationServer
				pagination
			/>,
		);

		// move to last page
		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);

		rerender(
			<DataTable
				data={mockOneDeleted}
				columns={mock.columns}
				onChangePage={onChangePageMock}
				paginationPerPage={1}
				paginationTotalRows={1}
				paginationRowsPerPageOptions={[1, 2]}
				onChangeRowsPerPage={onChangeRowsPerPageMock}
				paginationServer
				pagination
			/>,
		);

		expect(onChangePageMock).toBeCalledWith(1, 1);
	});

	test('should not change the page position when using paginationServer if there is only one page', () => {
		const mock = dataMock();
		const mockOneDeleted = dataMock().data.slice(0, 2);
		const onChangePageMock = vi.fn();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationServer
			/>,
		);

		// move to last page
		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);

		rerender(
			<DataTable
				data={mockOneDeleted}
				columns={mock.columns}
				onChangePage={onChangePageMock}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationServer
			/>,
		);

		expect(onChangePageMock).not.toBeCalled();
	});

	test('should call onChangePage with the correct values if paged forward', () => {
		const onChangePageMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				onChangePage={onChangePageMock}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(2, 2);
	});

	test('should call onChangePage with the correct values if paged backward', () => {
		const onChangePageMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				onChangePage={onChangePageMock}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(2, 2);

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(1, 2);
	});

	test('should not deselect all rows if using pagination and selectedRows', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
			/>,
		);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);
		expect(allCheck.checked).toBe(true);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(allCheck.checked).toBe(true);
	});

	test('should deselect all rows if using paginationServer and selectedRows', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
			/>,
		);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);
		expect(allCheck.checked).toBe(true);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(allCheck.checked).toBe(false);
	});

	test('should call onSelectedRowsChange when changing the page if using paginationServer and selectedRows', () => {
		const mock = dataMock();
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select all rows"]') as HTMLInputElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onSelectedRowsChange).toBeCalledTimes(2);
	});

	test('should not call onSelectedRowsChange when changing the page if using paginationServer, selectedRows, and persistSelectedOnPageChange', () => {
		const mock = dataMock();
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnPageChange: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);
	});

	test('should not render a select all checkbox when persistSelectedOnPageChange is true', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnPageChange: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
			/>,
		);

		expect(container.querySelector('input[name="Select all rows"]')).toBe(null);
	});

	test('should call onSelectedRowsChange when sorting if using paginationServer and selectedRows', () => {
		const mock = dataMock({ sortable: true });
		const onSelectedRowsChange = vi.fn();
		const onSortMock = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onSort={onSortMock}
				pagination
				paginationServer
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select all rows"]') as HTMLInputElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLButtonElement);
		expect(onSortMock).toBeCalled();
		expect(onSelectedRowsChange).toBeCalledTimes(2);
	});

	test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and all rows checked', () => {
		const mock = dataMock({ sortable: true });
		const onSelectedRowsChange = vi.fn();
		const onSortMock = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onSort={onSortMock}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnSort: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select all rows"]') as HTMLInputElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		expect(onSortMock).toBeCalled();
		expect(onSelectedRowsChange).toBeCalledTimes(1);
		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: true,
			selectedCount: 2,
			selectedRows: mock.data,
		});
	});

	test('should call onSelectedRowsChange when using paginationServer, selectedRows, and persistSelectedOnSort', () => {
		const mock = dataMock();
		mock.data[0].selected = true;

		const onSelectedRowsChange = vi.fn();

		render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				selectableRows
				selectableRowSelected={row => row.selected}
				onSelectedRowsChange={onSelectedRowsChange}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnSort: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
			/>,
		);

		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [
				{
					id: 1,
					some: {
						name: 'Apple',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: true,
				},
			],
		});
	});

	test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and all rows un-checked', () => {
		const mock = dataMock({ sortable: true });
		const onSelectedRowsChange = vi.fn();
		const onSortMock = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onSort={onSortMock}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnSort: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);
		// uncheck select all
		fireEvent.click(allCheck);
		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLInputElement);

		expect(onSortMock).toBeCalled();
		expect(onSelectedRowsChange).toBeCalledTimes(2);
		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 0,
			selectedRows: [],
		});
	});

	test('should call onSelectedRowsChange the correct amount of times when using paginationServer, selectedRows, and persistSelectedOnSort and a single row is checked', () => {
		const mock = dataMock({ sortable: true });
		const onSelectedRowsChange = vi.fn();
		const onSortMock = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				onSort={onSortMock}
				pagination
				paginationServer
				paginationServerOptions={{ persistSelectedOnSort: true }}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);
		expect(onSelectedRowsChange).toBeCalledTimes(1);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		expect(onSortMock).toBeCalled();
		expect(onSelectedRowsChange).toBeCalledTimes(1);
		expect(onSelectedRowsChange).toBeCalledWith({
			allSelected: false,
			selectedCount: 1,
			selectedRows: [
				{
					id: 1,
					some: {
						name: 'Apple',
					},
					completed: false,
					defaultExpanded: false,
					disabled: false,
					isSpecial: false,
					selected: false,
				},
			],
		});
	});

	test('should deselect all rows if using pagination && paginationServer and selectedRows and the table is sorted', () => {
		const mock = dataMock({ sortable: true });
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				selectableRows
			/>,
		);
		const allCheck = container.querySelector('input[name="Select all rows"]') as HTMLInputElement;

		fireEvent.click(allCheck);
		expect(allCheck.checked).toBe(true);

		fireEvent.click(container.querySelector('div[data-sort-id="1"]') as HTMLElement);
		expect(allCheck.checked).toBe(false);
	});

	test('should call onChangePage if paged with an the optional paginationTotalRows prop', () => {
		const onChangePageMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationTotalRows={10}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				onChangePage={onChangePageMock}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(2, 10);
	});

	test('should call onChangeRowsPerPage if paged', () => {
		const onChangeRowsPerPageMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} pagination onChangeRowsPerPage={onChangeRowsPerPageMock} />,
		);

		fireEvent.change(container.querySelector('select') as HTMLSelectElement, { target: { value: 20 } });
		expect(onChangeRowsPerPageMock).toBeCalledWith(20, 1);
	});

	test('should call onChangeRowsPerPage if paged when paginationServer is true', () => {
		const onChangeRowsPerPageMock = vi.fn();
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationServer
				onChangeRowsPerPage={onChangeRowsPerPageMock}
			/>,
		);

		fireEvent.change(container.querySelector('select') as HTMLSelectElement, { target: { value: 20 } });
		expect(onChangeRowsPerPageMock).toBeCalledWith(20, 1);
	});

	test('should render correctly when a paginationComponentOptions are passed', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationComponentOptions={{ rowsPerPageText: 'Fila por página' }}
			/>,
		);

		expect(container.querySelector('select')).not.toBeNull();
	});

	test('should render correctly when a paginationComponentOptions to hide the per page dropdown are passed', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationComponentOptions={{ noRowsPerPage: true }}
			/>,
		);

		expect(container.querySelector('select')).toBeNull();
	});

	test('should render correctly when a paginationComponentOptions selectAllRowsItem is true', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationComponentOptions={{ selectAllRowsItem: true }}
			/>,
		);

		expect(container.querySelector('select')).not.toBeNull();
	});

	test('should render correctly when a paginationComponentOptions selectAllRowsItem is true and selectAllRowsItemText is provided', () => {
		const mock = dataMock();
		const { getByText } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				pagination
				paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'Todos' }}
			/>,
		);

		expect(getByText('Todos')).not.toBeNull();
	});

	test('should navigate to the specified page when paginationPage changes', () => {
		const mock = dataMock();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationPage={1}
			/>,
		);

		rerender(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationPage={2}
			/>,
		);

		expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
	});

	test('should call onChangePage when paginationPage changes', () => {
		const mock = dataMock();
		const onChangePage = vi.fn();
		const { rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationPage={1}
				onChangePage={onChangePage}
			/>,
		);

		rerender(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1}
				paginationRowsPerPageOptions={[1, 2]}
				pagination
				paginationPage={2}
				onChangePage={onChangePage}
			/>,
		);

		expect(onChangePage).toHaveBeenCalledWith(2, mock.data.length);
	});

	test('should render correctly when paginationResetDefaultPage is toggled', () => {
		const mock = dataMock();
		const { container, rerender } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1} // force 2 pages
				paginationRowsPerPageOptions={[1, 2]} // force 2 pages
				pagination
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);

		rerender(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				paginationPerPage={1} // force 2 pages
				paginationRowsPerPageOptions={[1, 2]} // force 2 pages
				pagination
				paginationResetDefaultPage // this will toggle true and reset to page 1
			/>,
		);

		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
	});
	describe('paginationPosition', () => {
		test('should render pagination below the table by default', () => {
			const mock = dataMock();
			const { container } = render(<DataTable data={mock.data} columns={mock.columns} pagination />);

			const wrapper = container.firstElementChild as HTMLElement;
			const children = Array.from(wrapper.children);
			const tableIdx = children.findIndex(el => el.classList.contains('rdt_TableResponsive') || el.tagName === 'DIV');
			const paginationEl = container.querySelector('nav');
			const paginationParent = paginationEl?.parentElement;
			const paginationParentIdx = children.indexOf(paginationParent as Element);

			expect(paginationParentIdx).toBeGreaterThan(tableIdx);
		});

		test('should render pagination above the table when paginationPosition="top"', () => {
			const mock = dataMock();
			const { container } = render(
				<DataTable data={mock.data} columns={mock.columns} pagination paginationPosition="top" />,
			);

			const wrapper = container.firstElementChild as HTMLElement;
			const children = Array.from(wrapper.children);
			const responsiveWrapper = container.querySelector('.rdt_responsiveWrapper');
			const responsiveIdx = children.indexOf(responsiveWrapper as Element);
			const navEls = container.querySelectorAll('nav');

			expect(navEls).toHaveLength(1);
			const paginationParentIdx = children.indexOf(navEls[0].parentElement as Element);
			expect(paginationParentIdx).toBeGreaterThanOrEqual(0);
			expect(paginationParentIdx).toBeLessThan(responsiveIdx);
		});

		test('should render pagination above and below the table when paginationPosition="both"', () => {
			const mock = dataMock();
			const { container } = render(
				<DataTable data={mock.data} columns={mock.columns} pagination paginationPosition="both" />,
			);

			const navEls = container.querySelectorAll('nav');
			expect(navEls).toHaveLength(2);
		});

		test('should not render pagination when paginationPosition="top" and pagination is disabled', () => {
			const mock = dataMock();
			const { container } = render(<DataTable data={mock.data} columns={mock.columns} paginationPosition="top" />);

			expect(container.querySelector('nav')).toBeNull();
		});

		test('should navigate correctly when using paginationPosition="top"', () => {
			const mock = dataMock();
			const { container } = render(
				<DataTable
					data={mock.data}
					columns={mock.columns}
					pagination
					paginationPosition="top"
					paginationPerPage={1}
					paginationRowsPerPageOptions={[1, 2]}
				/>,
			);

			fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);

			expect(container.querySelector('div[id="row-1"]')).toBeNull();
			expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
		});

		test('both pagination bars stay in sync when paginationPosition="both"', () => {
			const mock = dataMock();
			const { container } = render(
				<DataTable
					data={mock.data}
					columns={mock.columns}
					pagination
					paginationPosition="both"
					paginationPerPage={1}
					paginationRowsPerPageOptions={[1, 2]}
				/>,
			);

			const nextButtons = container.querySelectorAll('button#pagination-next-page');
			fireEvent.click(nextButtons[0] as HTMLButtonElement);

			expect(container.querySelector('div[id="row-1"]')).toBeNull();
			expect(container.querySelector('div[id="row-2"]')).not.toBeNull();
		});
	});
});

describe('DataTable::subHeader', () => {
	test('should render correctly when a subheader is enabled', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} subHeader={<div />} />);

		expect(container.querySelector('.rdt_subheader')).not.toBeNull();
	});

	test('should render when subHeaderWrap is false', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} subHeader={<div />} subHeaderWrap={false} />,
		);

		expect(container.querySelector('.rdt_subheader')).not.toBeNull();
	});

	test('should render correctly with left align', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} subHeader={<div />} subHeaderAlign={Alignment.LEFT} />,
		);

		expect(container.querySelector('.rdt_subheaderLeft')).not.toBeNull();
	});

	test('should render correctly with center align', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} subHeader={<div />} subHeaderAlign={Alignment.CENTER} />,
		);

		expect(container.querySelector('.rdt_subheaderCenter')).not.toBeNull();
	});

	test('should render correctly with right align', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} subHeader={<div />} subHeaderAlign={Alignment.RIGHT} />,
		);

		expect(container.querySelector('.rdt_subheaderRight')).not.toBeNull();
	});
});

describe('DataTable::Header', () => {
	test('should render without a header if noHeader is true', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} noHeader />);

		expect(container.querySelector('.rdt_TableHeader')).toBeNull();
	});

	test('title should render correctly', () => {
		const mock = dataMock();
		const { getByText } = render(<DataTable data={mock.data} columns={mock.columns} title="whoa!" />);

		expect(getByText('whoa!')).not.toBeNull();
	});

	test('header should not display with no title', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_TableHeader')).toBeNull();
	});

	test('should render header actions when they are provided', () => {
		const mock = dataMock();
		const { getByText } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				title="whoa!"
				actions={
					<>
						<div>some action</div>, <div>some action 2</div>
					</>
				}
			/>,
		);

		expect(getByText('some action')).not.toBeNull();
	});

	test('should render the default context menu when using selectableRows', () => {
		// Context menu has been removed from this library. Selection state is still
		// reflected via onSelectedRowsChange. This test verifies that selecting a
		// row still works without any context menu appearing.
		const mock = dataMock();
		const onSelectedRowsChange = vi.fn();
		const { container } = render(
			<DataTable
				data={mock.data}
				columns={mock.columns}
				title="whoa!"
				selectableRows
				onSelectedRowsChange={onSelectedRowsChange}
			/>,
		);

		fireEvent.click(container.querySelector('input[name="Select row 1"]') as HTMLInputElement);

		expect(onSelectedRowsChange).toHaveBeenCalledWith(expect.objectContaining({ selectedCount: 1 }));
	});
});

describe('DataTable::fixedHeader', () => {
	test('should render correctly when fixedHeader', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} fixedHeader />);

		expect(container.querySelector('.rdt_headFixed')).not.toBeNull();
		expect(container.querySelector('.rdt_responsiveWrapperFixed')).not.toBeNull();
	});

	test('should render correctly when fixedHeader and fixedHeaderScrollHeight', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} fixedHeader fixedHeaderScrollHeight="100px" />,
		);

		const wrapper = container.querySelector('.rdt_responsiveWrapperFixed') as HTMLElement;
		expect(wrapper).not.toBeNull();
		expect(wrapper.style.maxHeight).toBe('100px');
	});
});

describe('DataTable::striped', () => {
	test('should render correctly when striped', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} striped />);

		expect(container.querySelector('.rdt_rowStriped')).not.toBeNull();
	});
});

describe('DataTable::highlightOnHover', () => {
	test('should render correctly when highlightOnHover', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} highlightOnHover />);

		expect(container.querySelector('.rdt_rowHighlight')).not.toBeNull();
	});
});

describe('DataTable::pointerOnHover', () => {
	test('should render correctly when pointerOnHover', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} pointerOnHover />);

		expect(container.querySelector('.rdt_rowPointer')).not.toBeNull();
	});
});

describe('DataTable::dense', () => {
	test('should render correctly when dense', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} dense />);

		expect(container.querySelector('.rdt_rowDense')).not.toBeNull();
	});
});

describe('DataTable::ariaLabel', () => {
	test('should render correctly when ariaLabel', () => {
		const mock = dataMock();
		const { getByRole } = render(<DataTable data={mock.data} columns={mock.columns} ariaLabel="Test Table" />);

		expect(getByRole('table').getAttribute('aria-label')).toBe('Test Table');
	});

	test('should render correctly when not ariaLabel', () => {
		const mock = dataMock();
		const { getByRole } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(getByRole('table').getAttribute('aria-label')).toBeNull();
	});

	test('should render with aria-label when ariaLabel', () => {
		const mock = dataMock();
		const { getByRole } = render(<DataTable data={mock.data} columns={mock.columns} ariaLabel="Test Table" />);

		const table = getByRole('table');
		expect(table.getAttribute('aria-label')).toBe('Test Table');
	});

	test('should not render with aria-label when not ariaLabel', () => {
		const mock = dataMock();
		const { getByRole } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const table = getByRole('table');
		expect(table.getAttribute('aria-label')).toBeNull();
	});
});

describe('DataTable::Theming', () => {
	test('should render correctly when a custom style is applied', () => {
		const mock = dataMock();
		const customStyles = {
			rows: {
				style: {
					color: 'red',
				},
			},
		};
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} customStyles={customStyles} />);

		const row = container.querySelector('.rdt_row') as HTMLElement;
		expect(row.style.color).toBe('red');
	});
});

describe('DataTable::conditionalRowStyles', () => {
	test('should render correctly when conditionalRowStyles are an empty array', () => {
		const mock = dataMock();
		mock.data[0].completed = true;

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} conditionalRowStyles={[]} />);

		expect(container.querySelector('div[id="row-1"]')).not.toBeNull();
	});

	test('should render correctly when conditionalRowStyles is defined and there is a match', () => {
		const mock = dataMock();
		mock.data[0].completed = true;

		const conditionalRowStyles: ConditionalStyles<Data>[] = [
			{
				when: row => !!row.completed,
				style: {
					backgroundColor: 'rgba(63, 195, 128, 0.9)',
					color: 'white',
				},
			},
		];

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} conditionalRowStyles={conditionalRowStyles} />,
		);

		const row1 = container.querySelector('div[id="row-1"]') as HTMLElement;
		expect(row1.style.backgroundColor).toBe('rgba(63, 195, 128, 0.9)');
	});

	test('should render correctly when conditionalRowStyles is defined and there is no match', () => {
		const mock = dataMock();
		mock.data[0].completed = false;
		const conditionalRowStyles: ConditionalStyles<Data>[] = [
			{
				when: row => !!row.completed,
				style: {
					backgroundColor: 'rgba(63, 195, 128, 0.9)',
					color: 'white',
				},
			},
		];

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} conditionalRowStyles={conditionalRowStyles} />,
		);

		const row1 = container.querySelector('div[id="row-1"]') as HTMLElement;
		expect(row1.style.backgroundColor).toBe('');
	});
});

test('should render correctly when conditionalRowStyles with classNames is used and there is a match', () => {
	const mock = dataMock();
	mock.data[0].completed = true;

	const conditionalRowStyles: ConditionalStyles<Data>[] = [
		{
			when: row => !!row.completed,
			classNames: ['leia'],
		},
	];

	const { container } = render(
		<DataTable data={mock.data} columns={mock.columns} conditionalRowStyles={conditionalRowStyles} />,
	);

	expect(container.querySelector('div[id="row-1"].leia')).not.toBeNull();
});

test('should render correctly when conditionalRowStyles is used with an expandableRows an expandableInheritConditionalStyles', () => {
	const mock = dataMock();
	mock.data[0].completed = true;
	const conditionalRowStyles: ConditionalStyles<Data>[] = [
		{
			when: row => !!row.completed,
			style: {
				backgroundColor: 'rgba(63, 195, 128, 0.9)',
				color: 'white',
			},
		},
	];

	const { container, getByTestId } = render(
		<DataTable
			data={mock.data}
			columns={mock.columns}
			conditionalRowStyles={conditionalRowStyles}
			expandableRows
			expandableInheritConditionalStyles
		/>,
	);

	fireEvent.click(getByTestId('expander-button-1'));

	// With expandableInheritConditionalStyles, the expanded row inherits the conditional style
	const expanderRow = container.querySelector('.rdt_ExpanderRow') as HTMLElement;
	expect(expanderRow).not.toBeNull();
	expect(expanderRow.style.backgroundColor).toBe('rgba(63, 195, 128, 0.9)');
});

test('should render correctly when conditionalRowStyles is used with an expandableRows an expandableInheritConditionalStyles with classNames instead of style', () => {
	const mock = dataMock();
	mock.data[0].completed = true;
	const conditionalRowStyles: ConditionalStyles<Data>[] = [
		{
			when: row => !!row.completed,
			classNames: ['leia'],
		},
	];

	const { container, getByTestId } = render(
		<DataTable
			data={mock.data}
			columns={mock.columns}
			conditionalRowStyles={conditionalRowStyles}
			expandableRows
			expandableInheritConditionalStyles
		/>,
	);

	fireEvent.click(getByTestId('expander-button-1'));

	expect(container.querySelector('.rdt_ExpanderRow.leia')).not.toBeNull();
});

describe('DataTable::column.style', () => {
	test('should render correctly when a style is set on a column', () => {
		const mock = dataMock();
		mock.columns[0].style = {
			backgroundColor: 'rgba(63, 195, 128, 0.9)',
		};

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell.style.backgroundColor).toBe('rgba(63, 195, 128, 0.9)');
	});
});

describe('DataTable::conditionalCellStyles', () => {
	test('should render correctly when conditionalCellStyles is defined and there is a match', () => {
		const mock = dataMock();
		mock.data[0].completed = true;
		mock.columns[0].conditionalCellStyles = [
			{
				when: (row: Data) => row.completed,
				style: {
					backgroundColor: 'rgba(63, 195, 128, 0.9)',
				},
			},
		];

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell.style.backgroundColor).toBe('rgba(63, 195, 128, 0.9)');
	});

	test('should render correctly when conditionalCellStyles style is a function', () => {
		const mock = dataMock();
		mock.data[0].completed = true;
		mock.data[0].isSpecial = true;
		mock.columns[0].conditionalCellStyles = [
			{
				when: (row: Data) => row.completed,
				style: (row: Data) => ({
					color: row.isSpecial ? 'pink' : 'inherit',
				}),
			},
		];

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell.style.color).toBe('pink');
	});

	test('should render correctly when conditionalCellStyles is defined and there is no match', () => {
		const mock = dataMock();
		mock.data[0].completed = false;
		mock.columns[0].conditionalCellStyles = [
			{
				when: (row: Data) => row.completed,
				style: {
					backgroundColor: 'rgba(63, 195, 128, 0.9)',
				},
			},
		];

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		const cell = container.querySelector('div[id="cell-1-1"]') as HTMLElement;
		expect(cell.style.backgroundColor).toBe('');
	});

	test('should render correctly when conditionalCellStyles with classNames is defined and there is a match', () => {
		const mock = dataMock();
		mock.data[0].completed = true;
		mock.columns[0].conditionalCellStyles = [
			{
				when: (row: Data) => row.completed,
				classNames: ['leia'],
			},
		];

		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('div[id="cell-1-1"].leia')).not.toBeNull();
	});
});

describe('DataTable::direction', () => {
	test('should render correctly when direction is auto', () => {
		const mock = dataMock();

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} pagination direction={Direction.AUTO} />,
		);

		expect(container.querySelector('.rdt_responsiveWrapper')?.getAttribute('dir')).toBeNull();
	});

	test('should render correctly when direction is rtl', () => {
		const mock = dataMock();

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} pagination direction={Direction.RTL} />,
		);

		expect(container.querySelector('.rdt_responsiveWrapper')?.getAttribute('dir')).toBe('rtl');
	});

	test('should render correctly when direction is ltr', () => {
		const mock = dataMock();

		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} pagination direction={Direction.LTR} />,
		);

		expect(container.querySelector('.rdt_responsiveWrapper')?.getAttribute('dir')).toBe('ltr');
	});
});

describe('DataTable::columnFilter', () => {
	test('renders filter icon button when column.filterable is true', () => {
		const mock = dataMock();
		const columns = [{ ...mock.columns[0], filterable: true }];
		const { container } = render(<DataTable data={mock.data} columns={columns} />);
		expect(container.querySelector('.rdt_filterIcon')).not.toBeNull();
	});

	test('does not render filter icon when filterable is not set', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);
		expect(container.querySelector('.rdt_filterIcon')).toBeNull();
	});

	test('opens filter panel when filter icon is clicked', () => {
		const mock = dataMock();
		const columns = [{ ...mock.columns[0], filterable: true }];
		const { container } = render(<DataTable data={mock.data} columns={columns} />);
		const btn = container.querySelector('.rdt_filterIcon') as HTMLButtonElement;
		fireEvent.click(btn);
		expect(container.querySelector('.rdt_filterPanel')).not.toBeNull();
	});

	test('filters rows after Apply is clicked (default contains match)', () => {
		const data = [
			{ id: 1, some: { name: 'Apple' } },
			{ id: 2, some: { name: 'Banana' } },
			{ id: 3, some: { name: 'Apricot' } },
		];
		const columns = [
			{
				name: 'Name',
				id: 'name',
				selector: (row: (typeof data)[0]) => row.some.name,
				filterable: true,
			},
		];
		const { container } = render(<DataTable data={data} columns={columns} />);
		fireEvent.click(container.querySelector('.rdt_filterIcon') as HTMLButtonElement);
		fireEvent.change(container.querySelector('.rdt_filterInput') as HTMLInputElement, { target: { value: 'ap' } });
		// data not yet filtered — Apply not clicked
		expect(container.querySelectorAll('.rdt_TableBody [role="row"]').length).toBe(3);
		fireEvent.click(container.querySelector('.rdt_filterBtnPrimary') as HTMLButtonElement);
		// Apple and Apricot match "ap"
		expect(container.querySelectorAll('.rdt_TableBody [role="row"]').length).toBe(2);
	});

	test('respects custom filterFunction (receives FilterState)', () => {
		const data = [
			{ id: 1, some: { name: 'Alpha' } },
			{ id: 2, some: { name: 'Beta' } },
		];
		const columns = [
			{
				name: 'Name',
				id: 'name',
				selector: (row: (typeof data)[0]) => row.some.name,
				filterable: true,
				filterFunction: (row: (typeof data)[0], filter: import('../types').FilterState) =>
					row.id === Number(filter.condition1.value ?? ''),
			},
		];
		const { container } = render(<DataTable data={data} columns={columns} />);
		fireEvent.click(container.querySelector('.rdt_filterIcon') as HTMLButtonElement);
		fireEvent.change(container.querySelector('.rdt_filterInput') as HTMLInputElement, { target: { value: '2' } });
		fireEvent.click(container.querySelector('.rdt_filterBtnPrimary') as HTMLButtonElement);
		expect(container.querySelectorAll('.rdt_TableBody [role="row"]').length).toBe(1);
	});

	test('calls onFilterChange with FilterState when Apply is clicked', () => {
		const mock = dataMock();
		const onFilterChange = vi.fn();
		const columns = [{ ...mock.columns[0], id: 'col1', filterable: true }];
		const { container } = render(
			<DataTable data={mock.data} columns={columns} onFilterChange={onFilterChange} filterValues={{}} />,
		);
		fireEvent.click(container.querySelector('.rdt_filterIcon') as HTMLButtonElement);
		fireEvent.change(container.querySelector('.rdt_filterInput') as HTMLInputElement, { target: { value: 'test' } });
		fireEvent.click(container.querySelector('.rdt_filterBtnPrimary') as HTMLButtonElement);
		expect(onFilterChange).toHaveBeenCalledWith('col1', {
			condition1: { operator: 'contains', value: 'test' },
		});
	});

	test('clears filter when Clear button is clicked', () => {
		const data = [
			{ id: 1, some: { name: 'Apple' } },
			{ id: 2, some: { name: 'Banana' } },
		];
		const columns = [
			{
				name: 'Name',
				id: 'name',
				selector: (row: (typeof data)[0]) => row.some.name,
				filterable: true,
			},
		];
		const { container } = render(<DataTable data={data} columns={columns} />);
		// Apply a filter first
		fireEvent.click(container.querySelector('.rdt_filterIcon') as HTMLButtonElement);
		fireEvent.change(container.querySelector('.rdt_filterInput') as HTMLInputElement, { target: { value: 'ap' } });
		fireEvent.click(container.querySelector('.rdt_filterBtnPrimary') as HTMLButtonElement);
		expect(container.querySelectorAll('.rdt_TableBody [role="row"]').length).toBe(1);
		// Reopen and clear
		fireEvent.click(container.querySelector('.rdt_filterIcon') as HTMLButtonElement);
		const clearBtn = container.querySelectorAll('.rdt_filterBtn')[0] as HTMLButtonElement;
		fireEvent.click(clearBtn);
		expect(container.querySelectorAll('.rdt_TableBody [role="row"]').length).toBe(2);
	});
});

describe('DataTable::columnResize', () => {
	test('renders resize handles on column headers when resizable=true', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} resizable />);
		const handles = container.querySelectorAll('.rdt_resizeHandle');
		expect(handles.length).toBe(mock.columns.length);
	});

	test('does not render resize handles when resizable is not set', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);
		expect(container.querySelectorAll('.rdt_resizeHandle').length).toBe(0);
	});

	test('updates column maxWidth after pointer drag', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} resizable />);
		const handle = container.querySelector('.rdt_resizeHandle') as HTMLElement;
		const headerCell = handle.closest('[data-column-id]') as HTMLElement;

		// jsdom has offsetWidth=0, so startWidth=0 (0 ?? 100 does NOT fallback since ?? only catches null/undefined)
		// delta = clientX 160 - startX 100 = 60 → newWidth = max(40, 0 + 60) = 60
		fireEvent.pointerDown(handle, { clientX: 100 });
		fireEvent.pointerMove(document, { clientX: 160 });
		fireEvent.pointerUp(document);

		// Column width is applied via maxWidth (buildCellStyle sets maxWidth from width prop)
		expect(headerCell.style.maxWidth).toBe('60px');
	});

	test('inverts drag delta in RTL so dragging the handle left widens the column', () => {
		const mock = dataMock();
		const { container } = render(
			<DataTable data={mock.data} columns={mock.columns} resizable direction={Direction.RTL} />,
		);
		const handle = container.querySelector('.rdt_resizeHandle') as HTMLElement;
		const headerCell = handle.closest('[data-column-id]') as HTMLElement;

		// Dragging left (clientX 100 → 40) is a -60 delta; in RTL it inverts to +60.
		// startWidth is 0 in jsdom → newWidth = max(40, 0 + 60) = 60
		fireEvent.pointerDown(handle, { clientX: 100 });
		fireEvent.pointerMove(document, { clientX: 40 });
		fireEvent.pointerUp(document);

		expect(headerCell.style.maxWidth).toBe('60px');
	});
});

describe('DataTable::columnGroups', () => {
	test('renders a group header cell when columnGroups is provided', () => {
		const mock = dataMock();
		// decorateColumns assigns id=1 to first column without explicit id
		const columnGroups = [{ name: 'Details', columnIds: [1] }];
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} columnGroups={columnGroups} />);
		expect(container.querySelector('.rdt_groupCell')).not.toBeNull();
	});

	test('does not render a group header cell without columnGroups', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);
		expect(container.querySelector('.rdt_groupCell')).toBeNull();
	});

	test('renders group cell text', () => {
		const mock = dataMock();
		// decorateColumns assigns id=1 to first column without explicit id
		const columnGroups = [{ name: 'Personal Info', columnIds: [1] }];
		const { getByText } = render(<DataTable data={mock.data} columns={mock.columns} columnGroups={columnGroups} />);
		expect(getByText('Personal Info')).not.toBeNull();
	});
});

describe('DataTable::footer', () => {
	test('does not render a footer row by default', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} />);

		expect(container.querySelector('.rdt_footer')).toBeNull();
	});

	test('renders a footer row when a column declares a static footer', () => {
		const columns = [{ id: 'name', name: 'Name', selector: (r: { name: string }) => r.name, footer: 'Total' }];
		const data = [
			{ id: 1, name: 'Apple' },
			{ id: 2, name: 'Banana' },
		];
		const { container, getByText } = render(<DataTable data={data} columns={columns} />);

		expect(container.querySelector('.rdt_footer')).not.toBeNull();
		expect(container.querySelector('.rdt_footerRow')).not.toBeNull();
		expect(getByText('Total')).not.toBeNull();
	});

	test('invokes a column footer function with filtered+sorted rows', () => {
		const footerFn = vi.fn((rows: { value: number }[]) => `Sum: ${rows.reduce((s, r) => s + r.value, 0)}`);
		const columns = [{ id: 'value', name: 'Value', selector: (r: { value: number }) => r.value, footer: footerFn }];
		const data = [
			{ id: 1, value: 10 },
			{ id: 2, value: 25 },
			{ id: 3, value: 7 },
		];
		const { getByText } = render(<DataTable data={data} columns={columns} />);

		expect(footerFn).toHaveBeenCalledWith(data);
		expect(getByText('Sum: 42')).not.toBeNull();
	});

	test('renders a footerCell per visible column (omit excluded)', () => {
		const columns = [
			{ id: 'a', name: 'A', selector: (r: { a: string }) => r.a, footer: 'A-foot' },
			{ id: 'b', name: 'B', selector: (r: { b: string }) => r.b, footer: 'B-foot', omit: true },
			{ id: 'c', name: 'C', selector: (r: { c: string }) => r.c, footer: 'C-foot' },
		];
		const data = [{ id: 1, a: 'a1', b: 'b1', c: 'c1' }];
		const { container } = render(<DataTable data={data} columns={columns} />);

		const footerCells = container.querySelectorAll('.rdt_footerCell');
		expect(footerCells.length).toBe(2);
	});

	test('renders a custom footerComponent and passes rows + columns', () => {
		const FooterComp = vi.fn(({ rows }: { rows: { id: number }[] }) => (
			<div data-testid="custom-footer">Rows: {rows.length}</div>
		));
		const mock = dataMock();
		const { getByTestId } = render(<DataTable data={mock.data} columns={mock.columns} footerComponent={FooterComp} />);

		expect(getByTestId('custom-footer').textContent).toBe('Rows: 2');
		expect(FooterComp).toHaveBeenCalled();
		const call = FooterComp.mock.calls[0][0] as { rows: unknown[]; columns: unknown[] };
		expect(call.rows.length).toBe(2);
		expect(call.columns.length).toBe(1);
	});

	test('footerComponent takes precedence over column footers', () => {
		const FooterComp = () => <div className="custom-footer-marker">Custom</div>;
		const columns = [{ id: 'name', name: 'Name', selector: (r: { name: string }) => r.name, footer: 'Column-Footer' }];
		const data = [{ id: 1, name: 'Apple' }];
		const { container, queryByText } = render(<DataTable data={data} columns={columns} footerComponent={FooterComp} />);

		expect(container.querySelector('.custom-footer-marker')).not.toBeNull();
		expect(queryByText('Column-Footer')).toBeNull();
	});

	test('showFooter=false suppresses the footer even when columns declare a footer', () => {
		const columns = [{ id: 'name', name: 'Name', selector: (r: { name: string }) => r.name, footer: 'Total' }];
		const data = [{ id: 1, name: 'Apple' }];
		const { container } = render(<DataTable data={data} columns={columns} showFooter={false} />);

		expect(container.querySelector('.rdt_footer')).toBeNull();
	});

	test('showFooter=true renders the footer row even with no column footers', () => {
		const mock = dataMock();
		const { container } = render(<DataTable data={mock.data} columns={mock.columns} showFooter />);

		expect(container.querySelector('.rdt_footer')).not.toBeNull();
	});

	test('does not render the footer while progressPending is true', () => {
		const columns = [{ id: 'name', name: 'Name', selector: (r: { name: string }) => r.name, footer: 'Total' }];
		const data = [{ id: 1, name: 'Apple' }];
		const { container } = render(<DataTable data={data} columns={columns} progressPending />);

		expect(container.querySelector('.rdt_footer')).toBeNull();
	});
});
