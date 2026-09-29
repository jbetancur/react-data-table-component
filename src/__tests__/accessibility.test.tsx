import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
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
];

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, filterable: true },
	{ id: 'age', name: 'Age', selector: r => r.age, sortable: true },
];

// Rules that need real layout (jsdom has none) or judge the whole page rather than the table.
const DISABLED_RULES = [
	'color-contrast',
	'region',
	'landmark-one-main',
	'page-has-heading-one',
	'html-has-lang',
	'document-title',
];

async function expectNoViolations() {
	const results = await axe.run(document.body, {
		rules: Object.fromEntries(DISABLED_RULES.map(id => [id, { enabled: false }])),
	});
	const violations = results.violations.map(v => ({
		id: v.id,
		nodes: v.nodes.map(n => ({ html: n.html, why: n.failureSummary })),
	}));
	expect(violations).toEqual([]);
}

const expandable = { expandableRows: true, expandableRowsComponent: () => <div>detail</div> };

const configurations: [string, React.ComponentProps<typeof DataTable<Row>>][] = [
	['default', { columns, data: rows }],
	[
		'title, subheader and pagination',
		{ columns, data: rows, title: 'People', subHeader: <span>Sub</span>, pagination: true },
	],
	['selection', { columns, data: rows, selectableRows: true }],
	['selection with hidden select-all', { columns, data: rows, selectableRows: true, selectableRowsNoSelectAll: true }],
	['expandable rows', { columns, data: rows, ...expandable }],
	['expanded row', { columns, data: rows, ...expandable, expandableRowExpanded: r => r.id === 1 }],
	['header menu button', { columns, data: rows, contextMenu: { trigger: 'menu-button' } }],
	['cellNavigation', { columns, data: rows, cellNavigation: true, selectableRows: true, ...expandable }],
	['grouped headers', { columns, data: rows, columnGroups: [{ name: 'Person', columnIds: ['name', 'age'] }] }],
	[
		'grouped headers with selection',
		{ columns, data: rows, selectableRows: true, columnGroups: [{ name: 'Person', columnIds: ['name', 'age'] }] },
	],
	[
		'pinned columns',
		{
			columns: [
				{ ...columns[0], pinned: 'left' },
				{ ...columns[1], pinned: 'right' },
			],
			data: rows,
		},
	],
	['resizable and reorderable', { columns: columns.map(c => ({ ...c, reorder: true })), data: rows, resizable: true }],
	['footer', { columns: [{ ...columns[0], footer: 'Total' }, columns[1]], data: rows }],
	['editable cells', { columns: [{ ...columns[0], editable: true }, columns[1]], data: rows }],
	['loading', { columns, data: rows, progressPending: true }],
	['no data', { columns, data: [] }],
];

describe('axe', () => {
	test.each(configurations)('%s', async (_name, props) => {
		render(<DataTable {...props} />);
		await expectNoViolations();
	});

	test('open filter panel', async () => {
		const { container } = render(<DataTable columns={columns} data={rows} />);
		fireEvent.click(container.querySelector('button.rdt_filterIcon') as HTMLElement);
		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		await expectNoViolations();
	});

	test('open set filter panel', async () => {
		const setColumns: TableColumn<Row>[] = [{ ...columns[0], filterType: 'set' }, columns[1]];
		const { container } = render(<DataTable columns={setColumns} data={rows} />);
		fireEvent.click(container.querySelector('button.rdt_filterIcon') as HTMLElement);
		await expectNoViolations();
	});

	test('open header menu', async () => {
		const { container } = render(<DataTable columns={columns} data={rows} contextMenu />);
		fireEvent.contextMenu(container.querySelector('.rdt_TableCol[data-column-id="name"]') as HTMLElement);
		expect(document.querySelector('[role="menu"]')).not.toBeNull();
		await expectNoViolations();
	});

	test('open row menu', async () => {
		const { container } = render(
			<DataTable
				columns={columns}
				data={rows}
				contextMenu
				contextMenuActions={{ row: r => [{ id: 'delete', label: `Delete ${r.name}` }] }}
			/>,
		);
		fireEvent.contextMenu(container.querySelector('#row-1') as HTMLElement);
		expect(document.querySelector('[role="menu"]')).not.toBeNull();
		await expectNoViolations();
	});

	test('cell editor open', async () => {
		const { container } = render(<DataTable columns={[{ ...columns[0], editable: true }, columns[1]]} data={rows} />);
		fireEvent.click(container.querySelector('.rdt_cellEditable') as HTMLElement);
		expect(container.querySelector('.rdt_cellEditing input')).not.toBeNull();
		await expectNoViolations();
	});
});

describe('header cell semantics', () => {
	test('the filter button is inside its columnheader, not a sibling of it', () => {
		const { container } = render(<DataTable columns={columns} data={rows} />);
		const filterButton = container.querySelector('button.rdt_filterIcon') as HTMLElement;
		expect(filterButton.closest('[role="columnheader"]')).toBe(container.querySelector('.rdt_TableCol'));
	});

	test('aria-sort lives on the columnheader cell', () => {
		const { container } = render(<DataTable columns={columns} data={rows} />);
		const header = container.querySelector('[role="columnheader"][data-column-id="name"]') as HTMLElement;
		expect(header.getAttribute('aria-sort')).toBe('none');
		expect(container.querySelector('[data-sort-handle]')?.hasAttribute('aria-sort')).toBe(false);
	});

	test('the inline editor is labelled by its column header, even when the name is JSX', () => {
		const jsxColumns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: (
					<span>
						Full <em>name</em>
					</span>
				),
				selector: r => r.name,
				editable: true,
			},
		];
		const { container } = render(<DataTable columns={jsxColumns} data={rows} />);
		fireEvent.click(container.querySelector('.rdt_cellEditable') as HTMLElement);
		const input = container.querySelector('.rdt_cellEditing input') as HTMLElement;
		const label = document.getElementById(input.getAttribute('aria-labelledby') as string);
		expect(label?.textContent).toBe('Full name');
		expect(label?.closest('[role="columnheader"]')).not.toBeNull();
	});

	test('the sort control is queryable as a button named after its column', () => {
		const { container, getByRole } = render(<DataTable columns={columns} data={rows} />);
		fireEvent.click(getByRole('button', { name: 'Name' }));
		expect(container.querySelector('[role="columnheader"][data-column-id="name"]')?.getAttribute('aria-sort')).toBe(
			'ascending',
		);
	});

	test('the filter button label names its column', () => {
		const { container } = render(<DataTable columns={columns} data={rows} />);
		expect(container.querySelector('button.rdt_filterIcon')?.getAttribute('aria-label')).toBe('Filter column: Name');
	});
});
