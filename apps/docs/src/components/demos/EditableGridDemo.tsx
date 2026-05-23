import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface LineItem {
	id: number;
	product: string;
	quantity: number;
	price: number;
}

const initialData: LineItem[] = [
	{ id: 1, product: 'Widget A', quantity: 4, price: 12.5 },
	{ id: 2, product: 'Widget B', quantity: 2, price: 34.0 },
	{ id: 3, product: 'Gadget Pro', quantity: 1, price: 89.99 },
	{ id: 4, product: 'Connector X', quantity: 10, price: 5.25 },
	{ id: 5, product: 'Cable Pack', quantity: 3, price: 18.0 },
];

export default function EditableGridDemo() {
	const [data, setData] = useState<LineItem[]>(initialData);

	const handleCellEdit = (row: LineItem, value: string, column: TableColumn<LineItem>) => {
		const field = column.id as keyof LineItem;
		setData(prev =>
			prev.map(r => {
				if (r.id !== row.id) return r;
				if (field === 'quantity') return { ...r, quantity: Math.max(0, parseInt(value) || 0) };
				if (field === 'price') return { ...r, price: Math.max(0, parseFloat(value) || 0) };
				return { ...r, [field]: value };
			}),
		);
	};

	const columns: TableColumn<LineItem>[] = [
		{
			id: 'product',
			name: 'Product',
			selector: r => r.product,
			editable: true,
			onCellEdit: handleCellEdit,
			width: '160px',
		},
		{
			id: 'quantity',
			name: 'Qty',
			selector: r => r.quantity,
			editable: true,
			editor: { type: 'number' },
			onCellEdit: handleCellEdit,
			right: true,
			width: '100px',
		},
		{
			id: 'price',
			name: 'Unit price',
			selector: r => r.price,
			editable: true,
			editor: { type: 'number' },
			onCellEdit: handleCellEdit,
			format: r => `$${r.price.toFixed(2)}`,
			right: true,
			width: '120px',
		},
		{
			id: 'total',
			name: 'Total',
			selector: r => r.quantity * r.price,
			format: r => `$${(r.quantity * r.price).toFixed(2)}`,
			right: true,
			width: '120px',
			style: { fontWeight: 600, color: '#1d4ed8' },
		},
	];

	const grandTotal = data.reduce((sum, r) => sum + r.quantity * r.price, 0);

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden">
			<DataTable
				columns={columns}
				data={data}
				highlightOnHover
				noDataComponent="No items"
			/>
			<div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm font-semibold">
				<span className="text-gray-500">{data.length} items</span>
				<span className="text-gray-900">Grand total: <span className="text-brand-600">${grandTotal.toFixed(2)}</span></span>
			</div>
		</div>
	);
}
