import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataTable from '../components/DataTable';
import type { TableColumn } from '../types';

type Row = { id: number; name: string; salary: number; active: boolean; joined: string };

const rows: Row[] = [
	{ id: 1, name: 'Alice', salary: 80000, active: true, joined: '2024-01-15' },
	{ id: 2, name: 'Bob', salary: 95000, active: false, joined: '2023-06-01' },
];

function clickCell(getByText: (s: string) => HTMLElement, text: string) {
	const node = getByText(text);
	// Walk up to the rdt_TableCell to fire onClick where the handler lives.
	let target: HTMLElement | null = node;
	while (target && !target.classList.contains('rdt_cellEditable')) {
		target = target.parentElement;
	}
	if (!target) {
		throw new Error(`No editable cell wrapping ${text}`);
	}
	fireEvent.click(target);
}

describe('inline editing: number editor', () => {
	test('renders a number input and commits on blur', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'salary', name: 'Salary', selector: r => r.salary, editor: { type: 'number', min: 0 }, onCellEdit },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, '80000');

		const input = await screen.findByDisplayValue('80000');
		expect((input as HTMLInputElement).type).toBe('number');
		fireEvent.change(input, { target: { value: '85000' } });
		fireEvent.blur(input);

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('85000');
	});
});

describe('inline editing: date editor', () => {
	test('renders a date input', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'joined', name: 'Joined', selector: r => r.joined, editor: { type: 'date' }, onCellEdit },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, '2024-01-15');

		const input = await screen.findByDisplayValue('2024-01-15');
		expect((input as HTMLInputElement).type).toBe('date');
	});
});

describe('inline editing: keyboard', () => {
	test('Enter commits the edit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, editable: true, onCellEdit },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const input = await screen.findByDisplayValue('Alice');
		fireEvent.change(input, { target: { value: 'Alicia' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Alicia');
	});

	test('Escape cancels without committing', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, editable: true, onCellEdit },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const input = await screen.findByDisplayValue('Alice');
		fireEvent.change(input, { target: { value: 'Alicia' } });
		fireEvent.keyDown(input, { key: 'Escape' });

		await waitFor(() => expect(screen.queryByDisplayValue('Alicia')).not.toBeInTheDocument());
		expect(onCellEdit).not.toHaveBeenCalled();
		expect(getByText('Alice')).toBeInTheDocument();
	});
});

describe('inline editing: checkbox editor', () => {
	test('click commits the toggled value instantly', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'active', name: 'Active', selector: r => r.active, editor: { type: 'checkbox' }, onCellEdit },
		];

		render(<DataTable columns={columns} data={rows} />);
		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes).toHaveLength(2);
		expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);

		fireEvent.click(checkboxes[0]);

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('false');
	});

	test('Space on the wrapper commits the toggle', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{ id: 'active', name: 'Active', selector: r => r.active, editor: { type: 'checkbox' }, onCellEdit },
		];

		render(<DataTable columns={columns} data={rows} />);
		const wrap = screen.getAllByRole('checkbox')[1].parentElement as HTMLElement;
		fireEvent.keyDown(wrap, { key: ' ' });

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		// Bob is inactive, so the toggle commits 'true'
		expect(onCellEdit.mock.calls[0][1]).toBe('true');
	});
});

describe('inline editing: select editor', () => {
	test('renders options with placeholder and commits on change', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: {
					type: 'select',
					placeholder: 'Pick a name',
					options: [
						{ value: 'Alice', label: 'Alice' },
						{ value: 'Zara', label: 'Zara' },
					],
				},
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const select = await screen.findByRole('combobox');
		expect(screen.getByText('Pick a name')).toBeInTheDocument();
		fireEvent.change(select, { target: { value: 'Zara' } });

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Zara');
	});
});

describe('inline editing: validation', () => {
	test('rejects edit when validate returns false (no callback fired)', async () => {
		const onCellEdit = vi.fn();
		const validate = vi.fn(() => false as const);
		const columns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, editable: true, onCellEdit, validate },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const input = await screen.findByDisplayValue('Alice');
		fireEvent.change(input, { target: { value: '' } });
		fireEvent.blur(input);

		await waitFor(() => expect(validate).toHaveBeenCalled());
		expect(onCellEdit).not.toHaveBeenCalled();
	});

	test('displays error message when validate returns a string', async () => {
		const onCellEdit = vi.fn();
		const validate = vi.fn(() => 'Must not be empty');
		const columns: TableColumn<Row>[] = [
			{ id: 'name', name: 'Name', selector: r => r.name, editable: true, onCellEdit, validate },
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const input = await screen.findByDisplayValue('Alice');
		fireEvent.change(input, { target: { value: '' } });
		fireEvent.blur(input);

		expect(await screen.findByRole('alert')).toHaveTextContent('Must not be empty');
		expect(onCellEdit).not.toHaveBeenCalled();
	});
});

describe('inline editing: custom editor', () => {
	test('renders the supplied render fn and commits via ctx.commit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: {
					type: 'custom',
					render: ctx => (
						<button data-testid="custom-commit" onClick={() => ctx.commit('Zara')}>
							save
						</button>
					),
				},
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const btn = await screen.findByTestId('custom-commit');
		fireEvent.click(btn);

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Zara');
	});

	test('receives the validation error via ctx.error after a rejected commit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: {
					type: 'custom',
					render: ctx => (
						<button data-testid="custom-commit" data-error={ctx.error ?? ''} onClick={() => ctx.commit('')}>
							save
						</button>
					),
				},
				validate: value => (value === '' ? 'Must not be empty' : true),
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const btn = await screen.findByTestId('custom-commit');
		expect(btn).toHaveAttribute('data-error', '');
		fireEvent.click(btn);

		await waitFor(() => expect(screen.getByTestId('custom-commit')).toHaveAttribute('data-error', 'Must not be empty'));
		expect(onCellEdit).not.toHaveBeenCalled();
	});

	test('focuses the element attached to ctx.inputRef on open and after a rejected commit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: {
					type: 'custom',
					render: ctx => (
						<>
							<input
								data-testid="custom-input"
								ref={ctx.inputRef}
								value={ctx.value}
								onChange={e => ctx.setValue(e.target.value)}
							/>
							<button data-testid="custom-save" onClick={() => ctx.commit('')}>
								save
							</button>
						</>
					),
				},
				validate: value => (value === '' ? 'Must not be empty' : true),
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const input = await screen.findByTestId('custom-input');
		await waitFor(() => expect(input).toHaveFocus());

		const saveBtn = screen.getByTestId('custom-save');
		saveBtn.focus();
		expect(input).not.toHaveFocus();
		fireEvent.click(saveBtn);

		await waitFor(() => expect(input).toHaveFocus());
		expect(onCellEdit).not.toHaveBeenCalled();
	});
});

describe('inline editing: textarea editor', () => {
	test('renders a textarea with default rows (3) and commits on blur', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea', placeholder: 'Enter description' },
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		expect(textarea.tagName.toLowerCase()).toBe('textarea');
		expect(textarea).toHaveAttribute('rows', '3');
		expect(textarea).toHaveAttribute('placeholder', 'Enter description');

		fireEvent.change(textarea, { target: { value: 'Alice\nLine 2\nLine 3' } });
		fireEvent.blur(textarea);

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Alice\nLine 2\nLine 3');
	});

	test('renders a textarea with custom rows', async () => {
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea', rows: 5 },
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		expect(textarea).toHaveAttribute('rows', '5');
	});

	test('Enter key does not commit, allowing newlines', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea' },
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		fireEvent.change(textarea, { target: { value: 'Alice\nNext line' } });
		fireEvent.keyDown(textarea, { key: 'Enter' });

		// Enter should NOT commit for textarea
		expect(onCellEdit).not.toHaveBeenCalled();
		expect(textarea).toHaveValue('Alice\nNext line');
	});

	test('Ctrl+Enter commits the edit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea' },
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		fireEvent.change(textarea, { target: { value: 'Alice\nNote line' } });
		fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Alice\nNote line');
	});

	test('Cmd/Meta+Enter commits the edit', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea' },
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		fireEvent.change(textarea, { target: { value: 'Alice\nMac note' } });
		fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });

		await waitFor(() => expect(onCellEdit).toHaveBeenCalled());
		expect(onCellEdit.mock.calls[0][1]).toBe('Alice\nMac note');
	});

	test('Escape cancels the edit without committing', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea' },
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		fireEvent.change(textarea, { target: { value: 'Alicia\nDraft' } });
		fireEvent.keyDown(textarea, { key: 'Escape' });

		await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
		expect(onCellEdit).not.toHaveBeenCalled();
		expect(getByText('Alice')).toBeInTheDocument();
	});

	test('validates textarea edits and displays error tooltip on rejection', async () => {
		const onCellEdit = vi.fn();
		const columns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				editor: { type: 'textarea' },
				validate: value => (value.trim().length < 5 ? 'Minimum 5 characters' : true),
				onCellEdit,
			},
		];

		const { getByText } = render(<DataTable columns={columns} data={rows} />);
		clickCell(getByText, 'Alice');

		const textarea = await screen.findByDisplayValue('Alice');
		fireEvent.change(textarea, { target: { value: 'Hi' } });
		fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

		await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Minimum 5 characters'));
		expect(textarea).toHaveAttribute('aria-invalid', 'true');
		expect(onCellEdit).not.toHaveBeenCalled();
	});
});
