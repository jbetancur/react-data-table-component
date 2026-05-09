import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	name: string;
	department: string;
	salary: number;
}

const data: Row[] = [
	{ id: 1, name: 'Aria Chen', department: 'Engineering', salary: 155000 },
	{ id: 2, name: 'Marcus Webb', department: 'Product', salary: 132000 },
	{ id: 3, name: 'Priya Kapoor', department: 'Design', salary: 118000 },
	{ id: 4, name: 'Jordan Ellis', department: 'Analytics', salary: 143000 },
	{ id: 5, name: 'Sam Rivera', department: 'Engineering', salary: 128000 },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Name', selector: r => r.name, sortable: true },
	{ name: 'Department', selector: r => r.department, sortable: true },
	{ name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}`, right: true },
];

type SepValue = false | true | 'full';

const SEP_OPTIONS: { label: string; value: SepValue; desc: string }[] = [
	{ label: 'None', value: false, desc: 'No separators' },
	{ label: 'Subtle', value: true, desc: 'Inset 60%-height' },
	{ label: 'Full', value: 'full', desc: 'Full-height line' },
];

const HEAD_OPTIONS: { label: string; value: SepValue; desc: string }[] = [
	{ label: 'None', value: false, desc: 'No separators' },
	{ label: 'Subtle', value: true, desc: 'Inset 60%-height (default)' },
	{ label: 'Full', value: 'full', desc: 'Full-height line' },
];

function ButtonGroup({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: { label: string; value: SepValue; desc: string }[];
	value: SepValue;
	onChange: (v: SepValue) => void;
}) {
	const current = options.find(o => o.value === value)!;
	return (
		<div className="flex items-center gap-3 flex-wrap text-sm">
			<span className="text-gray-500 w-36 shrink-0">{label}:</span>
			{options.map(o => (
				<button
					key={String(o.value)}
					onClick={() => onChange(o.value)}
					className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
						value === o.value
							? 'bg-brand-600 text-white border-brand-600'
							: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
					}`}
				>
					{o.label}
				</button>
			))}
			<span className="text-gray-400 text-xs ml-1">{current.desc}</span>
		</div>
	);
}

export default function ColumnSeparatorsDemo() {
	const [sep, setSep] = useState<SepValue>(true);
	const [headSep, setHeadSep] = useState<SepValue>(true);

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				<ButtonGroup label="Body separators" options={SEP_OPTIONS} value={sep} onChange={setSep} />
				<ButtonGroup label="Header separators" options={HEAD_OPTIONS} value={headSep} onChange={setHeadSep} />
			</div>
			<DataTable
				columns={columns}
				data={data}
				columnSeparator={sep || undefined}
				headerSeparator={headSep === false ? false : headSep === 'full' ? 'full' : undefined}
				highlightOnHover
				striped
			/>
		</div>
	);
}
