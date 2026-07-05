import React, { useState } from 'react';
import DataTable, { type ExpanderComponentProps, type TableColumn } from 'react-data-table-component';

interface Order {
	id: number;
	region: string;
	customer: string;
	amount: number;
}

interface RegionGroup {
	region: string;
	count: number;
	total: number;
	orders: Order[];
}

const ORDERS: Order[] = [
	{ id: 1, region: 'West',    customer: 'Acme Corp',        amount: 4200 },
	{ id: 2, region: 'West',    customer: 'Blue Harbor Inc',  amount: 1850 },
	{ id: 3, region: 'West',    customer: 'Candle Systems',   amount: 3100 },
	{ id: 4, region: 'East',    customer: 'Dynamo Energy',    amount: 2600 },
	{ id: 5, region: 'East',    customer: 'Evergreen Foods',  amount: 5400 },
	{ id: 6, region: 'Central', customer: 'Frontier Retail',  amount: 990 },
	{ id: 7, region: 'Central', customer: 'Granite Works',    amount: 2200 },
	{ id: 8, region: 'Central', customer: 'Harbor Logistics', amount: 1475 },
	{ id: 9, region: 'Central', customer: 'Ironclad Freight', amount: 3050 },
];

// Group flat rows into per-region summary rows — a plain reduce, no groupBy API required.
const groups: RegionGroup[] = Object.values(
	ORDERS.reduce<Record<string, RegionGroup>>((acc, order) => {
		const g = (acc[order.region] ??= { region: order.region, count: 0, total: 0, orders: [] });
		g.count += 1;
		g.total += order.amount;
		g.orders.push(order);
		return acc;
	}, {}),
);

const columns: TableColumn<RegionGroup>[] = [
	{ id: 'region', name: 'Region', selector: r => r.region, sortable: true, style: { fontWeight: 600 } },
	{ id: 'count',  name: 'Orders', selector: r => r.count,  sortable: true, right: true, width: '110px' },
	{
		id: 'total',
		name: 'Total',
		selector: r => r.total,
		sortable: true,
		right: true,
		width: '130px',
		format: r => `$${r.total.toLocaleString()}`,
		footer: (rows: RegionGroup[]) => `$${rows.reduce((sum, r) => sum + r.total, 0).toLocaleString()}`,
	},
];

function RegionOrders({ data }: ExpanderComponentProps<RegionGroup>) {
	return (
		<div style={{ padding: '10px 32px' }} className="bg-gray-50">
			<div className="space-y-1.5">
				{data.orders.map(order => (
					<div
						key={order.id}
						className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-md px-3 py-2"
					>
						<span className="text-gray-700">{order.customer}</span>
						<span className="font-medium text-gray-900">${order.amount.toLocaleString()}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default function RowGroupingDemo() {
	const [allExpanded, setAllExpanded] = useState(false);

	return (
		<div className="space-y-2">
			<div className="flex justify-end">
				<button
					onClick={() => setAllExpanded(v => !v)}
					className="px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:border-gray-300"
				>
					{allExpanded ? 'Collapse all' : 'Expand all'}
				</button>
			</div>
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					columns={columns}
					data={groups}
					keyField="region"
					expandableRows
					expandableRowsComponent={RegionOrders}
					expandableRowExpanded={() => allExpanded}
					highlightOnHover
					dense
				/>
			</div>
		</div>
	);
}
