import React, { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	region: string;
}

const regions = ['North', 'South', 'East', 'West'];

const data: Row[] = Array.from({ length: 9 }, (_, i) => ({
	id: i + 1,
	name: `Account ${String(i + 1).padStart(2, '0')}`,
	region: regions[i % regions.length],
}));

const columns: TableColumn<Row>[] = [
	{ name: 'Account', selector: r => r.name, sortable: true },
	{ name: 'Region', selector: r => r.region },
];

function Pane({ visibleOnly, title, note }: { visibleOnly: boolean; title: string; note: string }) {
	const [selected, setSelected] = useState<Row[]>([]);

	return (
		<div className="rounded-lg border border-gray-200 p-3 space-y-2">
			<div>
				<p className="text-sm font-semibold text-gray-800">{title}</p>
				<p className="text-xs text-gray-400 mt-0.5">{note}</p>
			</div>

			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectableRowsVisibleOnly={visibleOnly}
				pagination
				paginationPerPage={3}
				paginationRowsPerPageOptions={[3]}
				onSelectedRowsChange={({ selectedRows }) => setSelected(selectedRows)}
				dense
			/>

			<div className="text-xs font-mono min-h-[1.25rem]">
				<span className="text-gray-500">selected: </span>
				<span className={selected.length > 0 ? 'text-brand-600 font-medium' : 'text-gray-400'}>
					{selected.length > 0 ? `[${selected.map(r => r.id).join(', ')}]` : '[]'}
				</span>
			</div>
		</div>
	);
}

export default function VisibleOnlyDemo() {
	return (
		<div className="space-y-3">
			<p className="text-xs text-gray-500">
				Nine rows, three per page. In both tables: tick "select all" on page 1, then go to page 2.
			</p>

			<div className="grid gap-3 sm:grid-cols-2">
				<Pane
					visibleOnly={false}
					title="Default"
					note="Select all takes every row in the dataset, and the selection survives paging."
				/>
				<Pane
					visibleOnly
					title="selectableRowsVisibleOnly"
					note="Select all takes only the current page, and changing page clears the selection."
				/>
			</div>
		</div>
	);
}
