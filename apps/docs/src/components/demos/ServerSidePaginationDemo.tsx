import { useState, useEffect, useCallback, useRef } from 'react';
import DataTable from '../ThemedDataTable';
import { type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	department: string;
	salary: number;
	status: string;
}

const DB: Employee[] = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	name:
		[
			'Aria Chen',
			'Marcus Webb',
			'Priya Kapoor',
			'Jordan Ellis',
			'Sam Rivera',
			'Taylor Brooks',
			'Casey Morgan',
			'Alex Kim',
			'Morgan Lee',
			'Drew Park',
		][i % 10] + (i >= 10 ? ` ${Math.floor(i / 10) + 1}` : ''),
	department: ['Engineering', 'Product', 'Design', 'Analytics', 'Sales', 'HR'][i % 6],
	salary: 80000 + ((i * 1237) % 70000),
	status: ['Active', 'Remote', 'On Leave', 'Contractor'][i % 4],
}));

async function fakeFetch(page: number, perPage: number): Promise<{ rows: Employee[]; total: number }> {
	await new Promise(r => setTimeout(r, 300));
	const start = (page - 1) * perPage;
	return { rows: DB.slice(start, start + perPage), total: DB.length };
}

const columns: TableColumn<Employee>[] = [
	{ name: 'Name', selector: r => r.name },
	{ name: 'Department', selector: r => r.department },
	{ name: 'Salary', selector: r => r.salary, format: r => `$${r.salary.toLocaleString()}`, right: true },
	{ name: 'Status', selector: r => r.status },
];

export default function ServerSidePaginationDemo() {
	const [data, setData] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalRows, setTotal] = useState(0);
	const [perPage, setPerPage] = useState(10);
	const pageRef = useRef(1);

	const fetch = useCallback(async (page: number, pp: number) => {
		setLoading(true);
		const result = await fakeFetch(page, pp);
		setData(result.rows);
		setTotal(result.total);
		setLoading(false);
	}, []);

	useEffect(() => {
		fetch(1, perPage);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	function handlePageChange(page: number) {
		pageRef.current = page;
		fetch(page, perPage);
	}

	function handlePerPageChange(pp: number, page: number) {
		setPerPage(pp);
		pageRef.current = page;
		fetch(page, pp);
	}

	return (
		<DataTable
			columns={columns}
			data={data}
			progressPending={loading}
			pagination
			paginationServer
			paginationTotalRows={totalRows}
			onChangePage={handlePageChange}
			onChangeRowsPerPage={handlePerPageChange}
			highlightOnHover
			striped
		/>
	);
}
