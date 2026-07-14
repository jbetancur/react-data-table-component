import React, { useState } from 'react';
import DataTable, { type TableColumn } from 'react-data-table-component';

interface Contact {
	name: string;
	email: string;
	company: string;
}

const SAMPLE_CSV = `name,email,company
Aria Chen,aria@acme.com,Acme Corp
Marcus Webb,marcus@blueharbor.com,Blue Harbor Inc
Priya Kapoor,priya@candlesys.com,Candle Systems`;

// Naive CSV parser: no quoted-comma support. For production, use a proper CSV library.
function parseCsv(text: string): Contact[] {
	const [headerLine, ...lines] = text.trim().split('\n');
	const headers = headerLine.split(',').map(h => h.trim());

	return lines.filter(Boolean).map(line => {
		const cells = line.split(',').map(c => c.trim());
		return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ''])) as unknown as Contact;
	});
}

const columns: TableColumn<Contact>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'email', name: 'Email', selector: r => r.email, sortable: true, grow: 1 },
	{ id: 'company', name: 'Company', selector: r => r.company, sortable: true },
];

export default function CsvImportDemo() {
	const [data, setData] = useState<Contact[]>([]);
	const [error, setError] = useState<string | null>(null);

	function handleFile(file: File) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				setData(parseCsv(String(reader.result)));
				setError(null);
			} catch {
				setError('Could not parse that file as CSV.');
			}
		};
		reader.readAsText(file);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 flex-wrap">
				<label className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 cursor-pointer">
					Upload CSV file…
					<input
						type="file"
						accept=".csv,text/csv"
						className="hidden"
						onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
					/>
				</label>
				<button
					onClick={() => {
						setData(parseCsv(SAMPLE_CSV));
						setError(null);
					}}
					className="px-3 py-1.5 text-xs font-medium rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100"
				>
					Load sample CSV
				</button>
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
			<div className="rounded-xl border border-gray-200 overflow-hidden">
				<DataTable
					columns={columns}
					data={data}
					highlightOnHover
					noDataComponent={
						<div className="py-8 text-sm text-gray-400">Upload a CSV or load the sample to see it here</div>
					}
				/>
			</div>
		</div>
	);
}
