import React, { useEffect, useState } from 'react';
import DataTable, { type ConditionalStyles, type TableColumn } from 'react-data-table-component';

interface Ticker {
	symbol: string;
	name: string;
	price: number;
	change: number;
}

const INITIAL: Ticker[] = [
	{ symbol: 'ACME', name: 'Acme Corp', price: 182.4, change: 0 },
	{ symbol: 'BLTC', name: 'Baltic Freight', price: 64.12, change: 0 },
	{ symbol: 'CNDL', name: 'Candle Systems', price: 305.9, change: 0 },
	{ symbol: 'DYNM', name: 'Dynamo Energy', price: 48.77, change: 0 },
	{ symbol: 'EVRG', name: 'Evergreen Foods', price: 96.3, change: 0 },
];

const columns: TableColumn<Ticker>[] = [
	{ id: 'symbol', name: 'Symbol', selector: r => r.symbol, sortable: true, width: '110px', style: { fontWeight: 600 } },
	{ id: 'name', name: 'Name', selector: r => r.name, grow: 1 },
	{
		id: 'price',
		name: 'Price',
		selector: r => r.price,
		right: true,
		width: '110px',
		format: r => `$${r.price.toFixed(2)}`,
	},
	{
		id: 'change',
		name: 'Change',
		selector: r => r.change,
		right: true,
		width: '110px',
		cell: r => (
			<span className={r.change === 0 ? 'text-gray-400' : r.change > 0 ? 'text-green-600' : 'text-red-600'}>
				{r.change === 0 ? '—' : `${r.change > 0 ? '▲' : '▼'} ${Math.abs(r.change).toFixed(2)}`}
			</span>
		),
	},
];

export default function LiveUpdatesDemo() {
	const [data, setData] = useState<Ticker[]>(INITIAL);
	const [flashed, setFlashed] = useState<Set<string>>(new Set());

	useEffect(() => {
		const tick = setInterval(() => {
			const symbol = INITIAL[Math.floor(Math.random() * INITIAL.length)].symbol;
			const delta = +(Math.random() * 4 - 2).toFixed(2);

			setData(prev =>
				prev.map(r => (r.symbol === symbol ? { ...r, price: +(r.price + delta).toFixed(2), change: delta } : r)),
			);
			setFlashed(prev => new Set(prev).add(symbol));
			setTimeout(
				() =>
					setFlashed(prev => {
						const next = new Set(prev);
						next.delete(symbol);
						return next;
					}),
				600,
			);
		}, 1200);

		return () => clearInterval(tick);
	}, []);

	const conditionalRowStyles: ConditionalStyles<Ticker>[] = [
		{
			when: r => flashed.has(r.symbol),
			style: { backgroundColor: '#fefce8', transition: 'background-color 0.6s ease' },
		},
	];

	return (
		<div className="rounded-xl border border-gray-200 overflow-hidden">
			<DataTable
				columns={columns}
				data={data}
				keyField="symbol"
				conditionalRowStyles={conditionalRowStyles}
				highlightOnHover
				dense
			/>
		</div>
	);
}
