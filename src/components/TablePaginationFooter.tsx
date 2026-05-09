import * as React from 'react';
import { PaginationComponent, PaginationIcons, PaginationOptions } from '../types';
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
}: TablePaginationFooterProps): JSX.Element {
	return (
		<div>
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
