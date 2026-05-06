import * as React from 'react';
import { TableColumn } from '../types';

export interface UseColumnFilterResult<T> {
	filterValues: Record<string | number, string>;
	handleFilterChange: (columnId: string | number, value: string) => void;
	filteredData: (data: T[]) => T[];
}

export default function useColumnFilter<T>(
	columns: TableColumn<T>[],
	controlledFilterValues?: Record<string | number, string>,
	onFilterChangeProp?: (columnId: string | number, value: string) => void,
): UseColumnFilterResult<T> {
	const [internalFilterValues, setInternalFilterValues] = React.useState<Record<string | number, string>>({});
	const filterValues = controlledFilterValues ?? internalFilterValues;

	const handleFilterChange = React.useCallback(
		(columnId: string | number, value: string) => {
			if (onFilterChangeProp) {
				onFilterChangeProp(columnId, value);
			} else {
				setInternalFilterValues(prev => ({ ...prev, [columnId]: value }));
			}
		},
		[onFilterChangeProp],
	);

	const activeFilters = React.useMemo(
		() => (Object.entries(filterValues) as [string, string][]).filter(([, v]) => v.trim() !== ''),
		[filterValues],
	);

	const filteredData = React.useCallback(
		(data: T[]): T[] => {
			if (activeFilters.length === 0) return data;
			return data.filter(row =>
				activeFilters.every(([colId, filterVal]) => {
					const col = columns.find(c => String(c.id) === colId);
					if (!col) return true;
					if (col.filterFunction) return col.filterFunction(row, filterVal);
					const raw = col.selector ? col.selector(row) : '';
					return String(raw).toLowerCase().includes(filterVal.toLowerCase());
				}),
			);
		},
		[activeFilters, columns],
	);

	return { filterValues, handleFilterChange, filteredData };
}
