import React from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Product {
	id: number;
	sku: string;
	name: string;
	stock: number;
	price: number;
}

const initialData: Product[] = [
	{ id: 1, sku: 'CH-114', name: 'Aeron Chair', stock: 12, price: 745 },
	{ id: 2, sku: 'DK-208', name: 'Standing Desk', stock: 7, price: 890 },
	{ id: 3, sku: 'MN-330', name: '32" Monitor', stock: 24, price: 429 },
	{ id: 4, sku: 'KB-501', name: 'Mech Keyboard', stock: 41, price: 159 },
	{ id: 5, sku: 'LM-612', name: 'Desk Lamp', stock: 63, price: 49 },
];

function saveToServer(field: keyof Product, value: string | number): Promise<void> {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			if (field === 'price' && Number(value) > 1000) reject(new Error('Price exceeds the $1,000 cap'));
			else resolve();
		}, 900),
	);
}

export default function ServerSideEditDemo() {
	const [data, setData] = React.useState<Product[]>(initialData);
	const [savingId, setSavingId] = React.useState<number | null>(null);
	const [status, setStatus] = React.useState<{ ok: boolean; message: string } | null>(null);

	const handleCellEdit = async (row: Product, value: string, column: TableColumn<Product>) => {
		const field = column.id as keyof Product;
		const parsed = field === 'name' ? value : Number(value);
		setData(prev => prev.map(r => (r.id === row.id ? { ...r, [field]: parsed } : r)));
		setSavingId(row.id);
		setStatus({ ok: true, message: `Saving ${row.sku}…` });
		try {
			await saveToServer(field, parsed);
			setStatus({ ok: true, message: `Saved ${row.sku} → ${String(column.name)}: "${value}"` });
		} catch (err) {
			setData(prev => prev.map(r => (r.id === row.id ? { ...r, [field]: row[field] } : r)));
			setStatus({ ok: false, message: `${(err as Error).message} — rolled back ${row.sku}` });
		} finally {
			setSavingId(null);
		}
	};

	const columns: TableColumn<Product>[] = [
		{ id: 'sku', name: 'SKU', selector: r => r.sku, width: '90px' },
		{ id: 'name', name: 'Product', selector: r => r.name, editable: true, onCellEdit: handleCellEdit },
		{
			id: 'stock',
			name: 'Stock',
			selector: r => r.stock,
			right: true,
			editor: { type: 'number', min: 0, step: 1 },
			validate: value => (Number.isInteger(Number(value)) && Number(value) >= 0 ? true : 'Enter a whole number'),
			onCellEdit: handleCellEdit,
		},
		{
			id: 'price',
			name: 'Price',
			selector: r => r.price,
			format: r => `$${r.price.toLocaleString()}`,
			right: true,
			editor: { type: 'number', min: 0, step: 1 },
			validate: value => (Number(value) > 0 ? true : 'Enter a positive number'),
			onCellEdit: handleCellEdit,
		},
	];

	return (
		<div className="space-y-2">
			<p className="text-xs text-gray-400">
				Edits apply optimistically, then save to a simulated server with ~1s latency. The row dims while the save is in
				flight. The server rejects any <strong>Price</strong> over $1,000 — try it to watch the edit roll back.
			</p>
			<DataTable
				columns={columns}
				data={data}
				highlightOnHover
				conditionalRowStyles={[{ when: r => r.id === savingId, style: { opacity: 0.45 } }]}
			/>
			{status && (
				<div className={`text-xs font-mono ${status.ok ? 'text-emerald-600' : 'text-red-600'}`}>{status.message}</div>
			)}
		</div>
	);
}
