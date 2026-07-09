import { useState } from 'react';
import DataTable from '../ThemedDataTable';
import { Direction, type TableColumn } from 'react-data-table-component';

interface Employee {
	id: number;
	name: string;
	nameAr: string;
	department: string;
	departmentAr: string;
	salary: number;
}

const data: Employee[] = [
	{ id: 1,  name: 'Aria Chen',     nameAr: 'أريا تشن',      department: 'Engineering', departmentAr: 'هندسة',    salary: 155000 },
	{ id: 2,  name: 'Marcus Webb',   nameAr: 'ماركوس ويب',    department: 'Product',     departmentAr: 'منتج',     salary: 132000 },
	{ id: 3,  name: 'Priya Kapoor',  nameAr: 'بريا كابور',    department: 'Design',      departmentAr: 'تصميم',    salary: 118000 },
	{ id: 4,  name: 'Jordan Ellis',  nameAr: 'جوردان إليس',   department: 'Analytics',   departmentAr: 'تحليلات',  salary: 143000 },
	{ id: 5,  name: 'Sam Rivera',    nameAr: 'سام ريفيرا',    department: 'Engineering', departmentAr: 'هندسة',    salary: 128000 },
	{ id: 6,  name: 'Taylor Brooks', nameAr: 'تايلور بروكس',  department: 'Sales',       departmentAr: 'مبيعات',   salary: 97000  },
	{ id: 7,  name: 'Morgan Lee',    nameAr: 'مورغان لي',     department: 'Engineering', departmentAr: 'هندسة',    salary: 162000 },
	{ id: 8,  name: 'Casey Park',    nameAr: 'كيسي بارك',     department: 'Design',      departmentAr: 'تصميم',    salary: 109000 },
	{ id: 9,  name: 'Drew Santos',   nameAr: 'درو سانتوس',    department: 'Product',     departmentAr: 'منتج',     salary: 138000 },
	{ id: 10, name: 'Avery Johnson', nameAr: 'أفيري جونسون',  department: 'Sales',       departmentAr: 'مبيعات',   salary: 104000 },
	{ id: 11, name: 'Quinn Torres',  nameAr: 'كوين توريس',    department: 'Design',      departmentAr: 'تصميم',    salary: 109000 },
	{ id: 12, name: 'Devon Walsh',   nameAr: 'ديفون والش',    department: 'Engineering', departmentAr: 'هندسة',    salary: 134000 },
];

const DIRECTIONS = [
	{ label: 'LTR', value: Direction.LTR },
	{ label: 'RTL', value: Direction.RTL },
	{ label: 'AUTO', value: Direction.AUTO },
] as const;

export default function RTLDemo() {
	const [direction, setDirection] = useState<Direction>(Direction.LTR);
	const isRTL = direction === Direction.RTL;

	const columns: TableColumn<Employee>[] = [
		{
			name: isRTL ? 'الاسم' : 'Name',
			selector: r => isRTL ? r.nameAr : r.name,
			sortable: true,
			width: '200px',
			minWidth: '120px',
			reorder: true,
		},
		{
			name: isRTL ? 'القسم' : 'Department',
			selector: r => isRTL ? r.departmentAr : r.department,
			sortable: true,
			minWidth: '140px',
			reorder: true,
		},
		{
			name: isRTL ? 'الراتب' : 'Salary',
			selector: r => r.salary,
			format: r => `$${r.salary.toLocaleString()}`,
			right: true,
			sortable: true,
			width: '140px',
			reorder: true,
		},
	];

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-500">direction:</span>
				<div className="flex gap-1">
					{DIRECTIONS.map(({ label, value }) => (
						<button
							key={value}
							type="button"
							onClick={() => setDirection(value)}
							className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
								direction === value
									? 'bg-brand-600 text-white border-brand-600'
									: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<DataTable
				columns={columns}
				data={data}
				direction={direction}
				pagination
				paginationPerPage={5}
				highlightOnHover
				striped
				resizable
			/>
		</div>
	);
}
