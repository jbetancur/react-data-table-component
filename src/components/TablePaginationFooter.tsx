import * as React from 'react';
import type { PaginationComponent, PaginationIcons, PaginationOptions } from '../types';
import { Direction } from '../constants';

interface TablePaginationFooterProps {
	Pagination: PaginationComponent;
	onChangePage: (page: number) => void;
	onChangeRowsPerPage: (newRowsPerPage: number) => void;
	rowCount: number;
	currentPage: number;
	rowsPerPage: number;
	direction: Direction;
	paginationRowsPerPageOptions: number[];
	paginationIcons?: PaginationIcons;
	paginationComponentOptions: PaginationOptions;
	position?: 'top' | 'bottom' | 'both';
}

function TablePaginationFooter({
	Pagination,
	onChangePage,
	onChangeRowsPerPage,
	rowCount,
	currentPage,
	rowsPerPage,
	direction,
	paginationRowsPerPageOptions,
	paginationIcons,
	paginationComponentOptions,
	position,
}: TablePaginationFooterProps): JSX.Element {
	const border = '1px solid var(--rdt-color-divider, rgba(0, 0, 0, 0.12))';
	const wrapperStyle = position === 'top' ? { borderBottom: border } : { borderTop: border };

	return (
		<div style={wrapperStyle}>
			<Pagination
				onChangePage={onChangePage}
				onChangeRowsPerPage={onChangeRowsPerPage}
				rowCount={rowCount}
				currentPage={currentPage}
				rowsPerPage={rowsPerPage}
				direction={direction}
				paginationRowsPerPageOptions={paginationRowsPerPageOptions}
				paginationIcons={paginationIcons}
				paginationComponentOptions={paginationComponentOptions}
			/>
		</div>
	);
}

export default React.memo(TablePaginationFooter);
