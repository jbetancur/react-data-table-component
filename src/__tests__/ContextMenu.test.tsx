import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DataTable from '../components/DataTable';
import type { ContextMenuAction, TableColumn } from '../types';

interface Row {
	id: number;
	name: string;
	age: number;
}

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: row => row.name, sortable: true },
	{ id: 'age', name: 'Age', selector: row => row.age, sortable: true },
	{ id: 'notes', name: 'Notes', selector: () => '' },
];

const data: Row[] = [
	{ id: 1, name: 'Zeta', age: 40 },
	{ id: 2, name: 'Alpha', age: 30 },
];

function headerCell(container: HTMLElement, columnId: string) {
	return container.querySelector(`.rdt_TableCol[data-column-id="${columnId}"]`) as HTMLElement;
}

function menu() {
	return document.querySelector('[role="menu"]');
}

function menuItem(label: string) {
	return Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => el.textContent === label) as
		HTMLElement | undefined;
}

function firstColCells(container: HTMLElement) {
	return Array.from(container.querySelectorAll('.rdt_row')).map(
		row => (row.querySelector('[data-column-id]') as HTMLElement)?.textContent,
	);
}

describe('ContextMenu:header trigger', () => {
	test('right-click on a header opens the menu with built-in actions', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));

		expect(menu()).not.toBeNull();
		expect(menuItem('Sort ascending')).not.toBeUndefined();
		expect(menuItem('Sort descending')).not.toBeUndefined();
		expect(menuItem('Clear sort')).not.toBeUndefined();
		expect(menuItem('Pin left')).not.toBeUndefined();
		expect(menuItem('Pin right')).not.toBeUndefined();
		expect(menuItem('Hide column')).not.toBeUndefined();
		expect(menuItem('Reset table')).not.toBeUndefined();
	});

	test('no menu when contextMenu is not enabled', () => {
		const { container } = render(<DataTable columns={columns} data={data} />);

		fireEvent.contextMenu(headerCell(container, 'name'));

		expect(menu()).toBeNull();
	});

	test('non-sortable column omits the sort group', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'notes'));

		expect(menuItem('Sort ascending')).toBeUndefined();
		expect(menuItem('Hide column')).not.toBeUndefined();
	});

	test('kebab trigger renders a button per header and disables right-click', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu={{ trigger: 'menu-button' }} />);

		fireEvent.contextMenu(headerCell(container, 'name'));
		expect(menu()).toBeNull();

		const kebab = container.querySelector('button[aria-label="Column actions"]') as HTMLElement;
		expect(kebab).not.toBeNull();
		fireEvent.click(kebab);
		expect(menu()).not.toBeNull();
	});

	test('menu button renders after the filter icon on filterable columns', () => {
		const { container } = render(
			<DataTable
				columns={[{ id: 'name', name: 'Name', selector: (row: { name: string }) => row.name, filterable: true }]}
				data={data}
				contextMenu={{ trigger: 'menu-button' }}
			/>,
		);

		const head = container.querySelector('.rdt_cellBaseHead') as HTMLElement;
		const classes = Array.from(head.children).map(child => child.className);
		const filterIndex = classes.findIndex(c => c.includes('rdt_filterContainer'));
		const menuButtonIndex = classes.findIndex(c => c.includes('rdt_kebabIcon'));
		expect(filterIndex).toBeGreaterThan(-1);
		expect(menuButtonIndex).toBeGreaterThan(filterIndex);
	});

	test('header: false disables the header menu', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu={{ header: false }} />);

		fireEvent.contextMenu(headerCell(container, 'name'));

		expect(menu()).toBeNull();
	});
});

describe('ContextMenu:built-in actions', () => {
	test('sort ascending / descending sort explicitly', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Sort ascending') as HTMLElement);

		expect(menu()).toBeNull();
		expect(firstColCells(container)).toEqual(['Alpha', 'Zeta']);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Sort descending') as HTMLElement);
		expect(firstColCells(container)).toEqual(['Zeta', 'Alpha']);

		// Re-selecting the same direction keeps it (no toggle cycling)
		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Sort descending') as HTMLElement);
		expect(firstColCells(container)).toEqual(['Zeta', 'Alpha']);
	});

	test('hide column removes it and reset restores it', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'age'));
		fireEvent.click(menuItem('Hide column') as HTMLElement);
		expect(headerCell(container, 'age')).toBeNull();

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Reset table') as HTMLElement);
		expect(headerCell(container, 'age')).not.toBeNull();
	});

	test('pin left moves the column to the first position and offers unpin', () => {
		const onColumnOrderChange = vi.fn();
		const { container } = render(
			<DataTable columns={columns} data={data} contextMenu onColumnOrderChange={onColumnOrderChange} />,
		);

		fireEvent.contextMenu(headerCell(container, 'age'));
		fireEvent.click(menuItem('Pin left') as HTMLElement);

		const order = onColumnOrderChange.mock.calls[0][0] as TableColumn<Row>[];
		expect(order.map(c => c.id)).toEqual(['age', 'name', 'notes']);
		expect(order[0].pinned).toBe('left');

		fireEvent.contextMenu(headerCell(container, 'age'));
		expect(menuItem('Pin left')).toBeUndefined();
		expect(menuItem('Unpin')).not.toBeUndefined();
		fireEvent.click(menuItem('Unpin') as HTMLElement);

		const next = onColumnOrderChange.mock.calls[1][0] as TableColumn<Row>[];
		expect(next.map(c => c.id)).toEqual(['age', 'name', 'notes']);
		expect(next[0].pinned).toBeUndefined();
	});

	test('onContextMenuAction fires for built-ins with header context', () => {
		const onContextMenuAction = vi.fn();
		const { container } = render(
			<DataTable columns={columns} data={data} contextMenu onContextMenuAction={onContextMenuAction} />,
		);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Sort ascending') as HTMLElement);

		expect(onContextMenuAction).toHaveBeenCalledTimes(1);
		const [action, ctx] = onContextMenuAction.mock.calls[0];
		expect(action.id).toBe('sort-asc');
		expect(ctx.type).toBe('header');
		expect(ctx.column.id).toBe('name');
	});
});

describe('ContextMenu:custom header actions', () => {
	test('custom actions render after built-ins and fire onContextMenuAction', () => {
		const onContextMenuAction = vi.fn();
		const headerActions: ContextMenuAction[] = [{ id: 'export', label: 'Export column' }];
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu
				contextMenuActions={{ header: headerActions }}
				onContextMenuAction={onContextMenuAction}
			/>,
		);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.click(menuItem('Export column') as HTMLElement);

		const [action, ctx] = onContextMenuAction.mock.calls[0];
		expect(action.id).toBe('export');
		expect(ctx.column.id).toBe('name');
	});

	test('header actions can be a function of the column', () => {
		const headerFn = vi.fn((column: TableColumn<Row>) => [{ id: `custom-${column.id}`, label: `For ${column.id}` }]);
		const { container } = render(
			<DataTable columns={columns} data={data} contextMenu contextMenuActions={{ header: headerFn }} />,
		);

		fireEvent.contextMenu(headerCell(container, 'age'));
		expect(menuItem('For age')).not.toBeUndefined();
	});
});

describe('ContextMenu:row menu', () => {
	test('right-click on a row shows consumer actions and fires with row context', () => {
		const onContextMenuAction = vi.fn();
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu
				contextMenuActions={{ row: row => [{ id: 'delete', label: `Delete ${row.name}` }] }}
				onContextMenuAction={onContextMenuAction}
			/>,
		);

		fireEvent.contextMenu(container.querySelector('#row-1') as HTMLElement);
		fireEvent.click(menuItem('Delete Zeta') as HTMLElement);

		const [action, ctx] = onContextMenuAction.mock.calls[0];
		expect(action.id).toBe('delete');
		expect(ctx.type).toBe('row');
		expect(ctx.row.id).toBe(1);
	});

	test('row menu stays closed when the row has no actions', () => {
		const { container } = render(
			<DataTable columns={columns} data={data} contextMenu contextMenuActions={{ row: () => [] }} />,
		);

		fireEvent.contextMenu(container.querySelector('#row-1') as HTMLElement);
		expect(menu()).toBeNull();
	});

	test('row menu stays closed without contextMenuActions.row', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(container.querySelector('#row-1') as HTMLElement);
		expect(menu()).toBeNull();
	});

	test('row kebab renders with kebab trigger and opens the menu', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu={{ trigger: 'menu-button' }}
				contextMenuActions={{ row: row => [{ id: 'edit', label: `Edit ${row.name}` }] }}
			/>,
		);

		const kebabs = container.querySelectorAll('button[aria-label="Row actions"]');
		expect(kebabs.length).toBe(2);
		fireEvent.click(kebabs[1]);
		expect(menuItem('Edit Alpha')).not.toBeUndefined();
	});

	test('menuPosition start moves the row menu button to the inline start', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu={{ trigger: 'menu-button', menuPosition: 'start' }}
				contextMenuActions={{ row: () => [{ id: 'edit', label: 'Edit' }] }}
			/>,
		);

		const cell = container.querySelector('.rdt_rowKebabCell') as HTMLElement;
		expect(cell).not.toBeNull();
		expect(cell.classList.contains('rdt_rowKebabStart')).toBe(true);
	});

	test('menuPosition defaults to end (no start class)', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu={{ trigger: 'menu-button' }}
				contextMenuActions={{ row: () => [{ id: 'edit', label: 'Edit' }] }}
			/>,
		);

		const cell = container.querySelector('.rdt_rowKebabCell') as HTMLElement;
		expect(cell.classList.contains('rdt_rowKebabStart')).toBe(false);
	});

	test('row: false disables the row menu but keeps the header menu', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu={{ row: false }}
				contextMenuActions={{ row: () => [{ id: 'x', label: 'X' }] }}
			/>,
		);

		fireEvent.contextMenu(container.querySelector('#row-1') as HTMLElement);
		expect(menu()).toBeNull();

		fireEvent.contextMenu(headerCell(container, 'name'));
		expect(menu()).not.toBeNull();
	});
});

describe('ContextMenu:dismissal and keyboard', () => {
	test('Escape closes the menu', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.keyDown(menu() as Element, { key: 'Escape' });

		expect(menu()).toBeNull();
	});

	test('outside pointerdown closes the menu', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));
		fireEvent.pointerDown(document.body);

		expect(menu()).toBeNull();
	});

	test('arrow keys move focus between enabled items', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));
		const items = Array.from(document.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])'));
		expect(document.activeElement).toBe(items[0]);

		fireEvent.keyDown(menu() as Element, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(items[1]);

		fireEvent.keyDown(menu() as Element, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(items[0]);

		// wraps from first to last
		fireEvent.keyDown(menu() as Element, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(items[items.length - 1]);

		fireEvent.keyDown(menu() as Element, { key: 'End' });
		expect(document.activeElement).toBe(items[items.length - 1]);
		fireEvent.keyDown(menu() as Element, { key: 'Home' });
		expect(document.activeElement).toBe(items[0]);
	});

	test('menu has role=menu with items as menuitem and separators between groups', () => {
		const { container } = render(<DataTable columns={columns} data={data} contextMenu />);

		fireEvent.contextMenu(headerCell(container, 'name'));

		const m = menu() as HTMLElement;
		expect(m.getAttribute('aria-label')).toBe('Column menu');
		expect(m.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0);
		expect(m.querySelectorAll('[role="separator"]').length).toBeGreaterThan(0);
	});
});

describe('ContextMenu:localization', () => {
	test('labels come from localization.contextMenu', () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={data}
				contextMenu
				localization={{
					contextMenu: {
						sortAscLabel: 'Ordenar ascendente',
						hideColumnLabel: 'Ocultar columna',
						headerMenuAriaLabel: 'Menú de columna',
					},
				}}
			/>,
		);

		fireEvent.contextMenu(headerCell(container, 'name'));

		expect((menu() as HTMLElement).getAttribute('aria-label')).toBe('Menú de columna');
		expect(menuItem('Ordenar ascendente')).not.toBeUndefined();
		expect(menuItem('Ocultar columna')).not.toBeUndefined();
	});
});
