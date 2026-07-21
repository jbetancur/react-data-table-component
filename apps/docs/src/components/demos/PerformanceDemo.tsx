import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

type Row = {
	id: number;
	name: string;
	department: string;
	region: string;
	salary: number;
	score: number;
	[metric: `m${number}`]: number;
};

const FIRST = ['Aria', 'Marcus', 'Priya', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Alex', 'Morgan', 'Drew', 'Riley', 'Jamie'];
const LAST = ['Chen', 'Webb', 'Kapoor', 'Ellis', 'Rivera', 'Brooks', 'Morgan', 'Kim', 'Lee', 'Park', 'Nguyen', 'Okafor'];
const DEPTS = ['Engineering', 'Product', 'Design', 'Analytics', 'Sales', 'HR'];
const REGIONS = ['NA', 'EMEA', 'APAC', 'LATAM'];

// Deterministic PRNG so every visitor stresses the same dataset
function mulberry32(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function generate(rowCount: number, metricCount: number): Row[] {
	const rand = mulberry32(rowCount * 31 + metricCount);
	const rows: Row[] = new Array(rowCount);
	for (let i = 0; i < rowCount; i++) {
		const row: Row = {
			id: i + 1,
			name: `${FIRST[(rand() * FIRST.length) | 0]} ${LAST[(rand() * LAST.length) | 0]}`,
			department: DEPTS[(rand() * DEPTS.length) | 0],
			region: REGIONS[(rand() * REGIONS.length) | 0],
			salary: 45000 + ((rand() * 1200) | 0) * 100,
			score: Math.round(rand() * 1000) / 10,
		};
		for (let m = 0; m < metricCount; m++) {
			row[`m${m}`] = Math.round(rand() * 10000) / 100;
		}
		rows[i] = row;
	}
	return rows;
}

const ROW_OPTIONS = [1_000, 10_000, 50_000, 100_000];
const COL_OPTIONS = [6, 20, 40];
const fmt = (n: number) => n.toLocaleString('en-US');

type Features = {
	resizable: boolean;
	reorder: boolean;
	selection: boolean;
	expandable: boolean;
	keyboardNav: boolean;
	animations: boolean;
};

const FEATURE_TOGGLES: { key: keyof Features; label: string }[] = [
	{ key: 'resizable', label: 'Resizable' },
	{ key: 'reorder', label: 'Column reorder' },
	{ key: 'selection', label: 'Selection' },
	{ key: 'expandable', label: 'Expandable rows' },
	{ key: 'keyboardNav', label: 'Keyboard nav' },
	{ key: 'animations', label: 'Row animations' },
];

const Expander = ({ data }: { data: Row }) => (
	<div className="px-6 py-3 text-xs text-gray-500">
		{data.name} · {data.department} · {data.region} · ${fmt(data.salary)}
	</div>
);

export default function PerformanceDemo() {
	const [rowCount, setRowCount] = useState(10_000);
	const [colCount, setColCount] = useState(6);
	const [perPage, setPerPage] = useState(25);
	const [features, setFeatures] = useState<Features>({
		resizable: false,
		reorder: false,
		selection: false,
		expandable: false,
		keyboardNav: false,
		animations: false,
	});
	const [lastPaint, setLastPaint] = useState<number | null>(null);
	const interactionStart = useRef<number | null>(null);
	const genMs = useRef(0);

	const data = useMemo(() => {
		const t0 = performance.now();
		const rows = generate(rowCount, colCount - 6);
		genMs.current = performance.now() - t0;
		return rows;
	}, [rowCount, colCount]);

	const columns = useMemo<TableColumn<Row>[]>(() => {
		const base: TableColumn<Row>[] = [
			{ id: 'id', name: 'ID', selector: r => r.id, sortable: true, width: '80px' },
			{ id: 'name', name: 'Name', selector: r => r.name, sortable: true, filterable: true, minWidth: '150px' },
			{ id: 'department', name: 'Department', selector: r => r.department, sortable: true, filterable: true },
			{ id: 'region', name: 'Region', selector: r => r.region, sortable: true, width: '90px' },
			{ id: 'salary', name: 'Salary', selector: r => r.salary, sortable: true, right: true, format: r => `$${fmt(r.salary)}` },
			{ id: 'score', name: 'Score', selector: r => r.score, sortable: true, right: true },
		];
		for (let m = 0; m < colCount - 6; m++) {
			base.push({
				id: `m${m}`,
				name: `Metric ${m + 1}`,
				selector: r => r[`m${m}`],
				sortable: true,
				right: true,
				minWidth: '110px',
			});
		}
		return features.reorder ? base.map(c => ({ ...c, reorder: true })) : base;
	}, [colCount, features.reorder]);

	// Measure click → commit for any interaction inside the demo (buttons,
	// header sorts, pagination, filters). The effect runs after React commits.
	useEffect(() => {
		if (interactionStart.current === null) return;
		const elapsed = performance.now() - interactionStart.current;
		interactionStart.current = null;
		setLastPaint(elapsed);
	});

	const markInteraction = () => {
		interactionStart.current = performance.now();
	};

	const btnBase = 'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer';
	const btnOn = 'bg-brand-600 text-white border-brand-600';
	const btnOff = 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';

	return (
		<div className="space-y-3" onClickCapture={markInteraction} onKeyDownCapture={markInteraction}>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">Rows</span>
					{ROW_OPTIONS.map(n => (
						<button
							key={n}
							className={`${btnBase} ${rowCount === n ? btnOn : btnOff}`}
							onClick={() => setRowCount(n)}
						>
							{fmt(n)}
						</button>
					))}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">Columns</span>
					{COL_OPTIONS.map(n => (
						<button
							key={n}
							className={`${btnBase} ${colCount === n ? btnOn : btnOff}`}
							onClick={() => setColCount(n)}
						>
							{n}
						</button>
					))}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs text-gray-400">Features</span>
					{FEATURE_TOGGLES.map(({ key, label }) => (
						<button
							key={key}
							className={`${btnBase} ${features[key] ? btnOn : btnOff}`}
							onClick={() => setFeatures(prev => ({ ...prev, [key]: !prev[key] }))}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<div className="text-xs text-gray-500 font-mono">
				{fmt(rowCount)} rows × {colCount} cols ({fmt(rowCount * colCount)} cells) · generated in{' '}
				{genMs.current.toFixed(0)}ms · {fmt(perPage)} rows in the DOM
				{lastPaint !== null && <> · last interaction → render: {lastPaint.toFixed(0)}ms</>}
			</div>

			<DataTable
				columns={columns}
				data={data}
				pagination
				paginationPerPage={25}
				paginationRowsPerPageOptions={[25, 100, 200, 300, 400, 500]}
				onChangeRowsPerPage={n => setPerPage(n)}
				fixedHeader
				fixedHeaderScrollHeight="420px"
				dense
				highlightOnHover
				resizable={features.resizable}
				selectableRows={features.selection}
				expandableRows={features.expandable}
				expandableRowsComponent={Expander}
				cellNavigation={features.keyboardNav}
				animateRows={features.animations}
			/>

			<p className="text-xs text-gray-400">
				Sorting and filtering always run over the full dataset. Click a column header or filter Name at 100,000
				rows to see the cost. Only the current page renders to the DOM; switch to 500 rows per page to stress
				actual DOM size. Each feature toggle remounts its extra cells and handlers, so flip them at 500 rows per
				page to see what they cost. Try dragging a column edge (Resizable) or a header (Column reorder), and use
				arrow keys after clicking a cell (Keyboard nav).
			</p>
		</div>
	);
}
