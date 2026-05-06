import { useState, useRef } from 'react';
import DataTable, { type TableColumn, type DataTableHandle } from 'react-data-table-component';

interface Row { id: number; name: string; role: string; department: string }

const data: Row[] = [
  { id: 1, name: 'Aria Chen',     role: 'Engineering Lead',  department: 'Engineering' },
  { id: 2, name: 'Marcus Webb',   role: 'Product Manager',   department: 'Product' },
  { id: 3, name: 'Priya Kapoor',  role: 'Senior Designer',   department: 'Design' },
  { id: 4, name: 'Jordan Ellis',  role: 'Data Scientist',    department: 'Analytics' },
  { id: 5, name: 'Sam Rivera',    role: 'DevOps Engineer',   department: 'Engineering' },
  { id: 6, name: 'Taylor Brooks', role: 'Account Manager',   department: 'Sales' },
];

const columns: TableColumn<Row>[] = [
  { name: 'Name',       selector: r => r.name,       sortable: true },
  { name: 'Role',       selector: r => r.role },
  { name: 'Department', selector: r => r.department, sortable: true },
];

export default function SelectionDemo() {
  const [selectedRows, setSelectedRows] = useState<Row[]>([]);
  const [single, setSingle] = useState(false);
  const ref = useRef<DataTableHandle>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm flex-wrap">
        <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
          <input type="checkbox" checked={single} onChange={e => setSingle(e.target.checked)} className="rounded" />
          Single select
        </label>
        <button
          onClick={() => ref.current?.clearSelectedRows()}
          className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 hover:text-gray-900"
        >
          Clear selection
        </button>
        {selectedRows.length > 0 && (
          <span className="text-brand-600 font-medium ml-auto">
            {selectedRows.length} selected: {selectedRows.map(r => r.name).join(', ')}
          </span>
        )}
      </div>

      <DataTable
        ref={ref}
        columns={columns}
        data={data}
        selectableRows
        selectableRowsSingle={single}
        onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
        highlightOnHover
        columnSeparator
      />
    </div>
  );
}
