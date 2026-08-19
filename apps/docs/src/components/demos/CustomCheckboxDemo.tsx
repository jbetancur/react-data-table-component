import React, { useState, forwardRef } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Row {
	id: number;
	track: string;
	artist: string;
	length: string;
}

const data: Row[] = [
	{ id: 1, track: 'Midnight Static', artist: 'Vela Nine', length: '3:42' },
	{ id: 2, track: 'Paper Ghosts', artist: 'The Longwave', length: '4:15' },
	{ id: 3, track: 'Neon Orchard', artist: 'Kite Parade', length: '2:58' },
	{ id: 4, track: 'Slow Cartography', artist: 'Ansel Frame', length: '5:07' },
];

const columns: TableColumn<Row>[] = [
	{ name: 'Track', selector: r => r.track, sortable: true },
	{ name: 'Artist', selector: r => r.artist },
	{ name: 'Length', selector: r => r.length, right: true },
];

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
	accent?: string;
};

/**
 * The ref must land on a real <input>: DataTable sets `.indeterminate` on it directly.
 * Everything visual is a sibling overlay driven by :checked, so the input itself stays
 * a functioning checkbox for keyboard and assistive tech.
 */
const VinylCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ accent = '#7c3aed', checked, disabled, ...rest }, ref) => (
		<label
			className="vinyl-wrap"
			style={{
				['--vinyl-accent' as string]: accent,
				opacity: disabled ? 0.4 : 1,
				cursor: disabled ? 'not-allowed' : 'pointer',
			}}
		>
			<input ref={ref} type="checkbox" checked={checked} disabled={disabled} {...rest} />
			<span className="vinyl-disc" aria-hidden="true">
				<span className="vinyl-label" />
			</span>
		</label>
	),
);

VinylCheckbox.displayName = 'VinylCheckbox';

const styles = `
.vinyl-wrap {
	position: relative;
	display: inline-flex;
	width: 22px;
	height: 22px;
	align-items: center;
	justify-content: center;
}
.vinyl-wrap input {
	position: absolute;
	inset: 0;
	margin: 0;
	opacity: 0;
	width: 100%;
	height: 100%;
	cursor: inherit;
}
.vinyl-disc {
	width: 20px;
	height: 20px;
	border-radius: 999px;
	background: repeating-radial-gradient(circle at 50% 50%, #1f2937 0 2px, #111827 2px 3px);
	box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.5);
	display: grid;
	place-items: center;
	transition: transform 0.35s ease, box-shadow 0.2s ease;
}
.vinyl-label {
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: #9ca3af;
	transition: background 0.2s ease, transform 0.2s ease;
}
.vinyl-wrap input:checked ~ .vinyl-disc {
	transform: rotate(180deg);
	box-shadow: 0 0 0 2px var(--vinyl-accent), 0 0 10px -1px var(--vinyl-accent);
}
.vinyl-wrap input:checked ~ .vinyl-disc .vinyl-label {
	background: var(--vinyl-accent);
	transform: scale(1.25);
}
/* Indeterminate: DataTable sets this directly on the input for the header checkbox. */
.vinyl-wrap input:indeterminate ~ .vinyl-disc {
	box-shadow: 0 0 0 2px #f59e0b;
}
.vinyl-wrap input:indeterminate ~ .vinyl-disc .vinyl-label {
	background: #f59e0b;
	transform: scale(0.6);
}
.vinyl-wrap input:focus-visible ~ .vinyl-disc {
	outline: 2px solid var(--vinyl-accent);
	outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
	.vinyl-disc { transition: none; }
}
`;

export default function CustomCheckboxDemo() {
	const [selected, setSelected] = useState<Row[]>([]);
	const [accent, setAccent] = useState('#7c3aed');

	return (
		<div className="space-y-3">
			<style dangerouslySetInnerHTML={{ __html: styles }} />

			<div className="flex items-center gap-3 text-sm flex-wrap">
				<span className="text-gray-500 text-xs">Accent, forwarded via selectableRowsComponentProps:</span>
				{[
					['#7c3aed', 'violet'],
					['#0891b2', 'cyan'],
					['#e11d48', 'rose'],
				].map(([value, label]) => (
					<button
						key={value}
						onClick={() => setAccent(value)}
						className={`px-2.5 py-1 text-xs border rounded-md ${
							accent === value ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-500'
						}`}
					>
						<span
							className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
							style={{ background: value }}
						/>
						{label}
					</button>
				))}
			</div>

			<DataTable
				columns={columns}
				data={data}
				keyField="id"
				selectableRows
				selectableRowsComponent={VinylCheckbox}
				selectableRowsComponentProps={{ accent }}
				selectableRowDisabled={r => r.id === 4}
				onSelectedRowsChange={({ selectedRows }) => setSelected(selectedRows)}
				highlightOnHover
			/>

			<div className="text-sm min-h-[1.25rem]">
				{selected.length > 0 ? (
					<span className="text-brand-600 font-medium">
						{selected.length} queued: {selected.map(r => r.track).join(', ')}
					</span>
				) : (
					<span className="text-gray-400 text-xs">
						Select a few rows. "Slow Cartography" is disabled, and the header disc turns amber when the
						selection is partial.
					</span>
				)}
			</div>
		</div>
	);
}
