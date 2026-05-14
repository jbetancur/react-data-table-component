import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import Select from './Select';
import { getNumberOfPages } from '../util';
import useWindowSize from '../hooks/useWindowSize';
import useRTL from '../hooks/useRTL';
import { Direction } from '../constants';
import type { PaginationIcons, PaginationOptions, PaginationChangePage } from '../types';
import { defaultProps, DEFAULT_PAGINATION_ICONS } from '../defaultProps';

const defaultComponentOptions = {
	rowsPerPageText: 'Rows per page:',
	rangeSeparatorText: 'of',
	noRowsPerPage: false,
	selectAllRowsItem: false,
	selectAllRowsItemText: 'All',
};

interface PaginationProps {
	rowsPerPage: number;
	rowCount: number;
	currentPage: number;
	direction?: Direction;
	paginationRowsPerPageOptions?: number[];
	paginationIcons?: PaginationIcons;
	paginationComponentOptions?: PaginationOptions;
	onChangePage: PaginationChangePage;
	onChangeRowsPerPage: (numRows: number, currentPage: number) => void;
}

function Pagination({
	rowsPerPage,
	rowCount,
	currentPage,
	direction = defaultProps.direction,
	paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
	paginationIcons = DEFAULT_PAGINATION_ICONS,
	paginationComponentOptions = defaultProps.paginationComponentOptions,
	onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
	onChangePage = defaultProps.onChangePage,
}: PaginationProps): JSX.Element {
	const windowSize = useWindowSize();
	const isRTL = useRTL(direction);
	const shouldShow = windowSize.width && windowSize.width > 599;
	const numPages = getNumberOfPages(rowCount, rowsPerPage);
	const lastIndex = currentPage * rowsPerPage;
	const firstIndex = lastIndex - rowsPerPage + 1;
	const disabledLesser = currentPage === 1;
	const disabledGreater = currentPage === numPages;
	const options = { ...defaultComponentOptions, ...paginationComponentOptions };
	const range =
		currentPage === numPages
			? `${firstIndex}-${rowCount} ${options.rangeSeparatorText} ${rowCount}`
			: `${firstIndex}-${lastIndex} ${options.rangeSeparatorText} ${rowCount}`;

	const icons = { ...DEFAULT_PAGINATION_ICONS, ...paginationIcons };

	const handlePrevious = React.useCallback(
		() => onChangePage(currentPage - 1, rowCount),
		[currentPage, onChangePage, rowCount],
	);
	const handleNext = React.useCallback(
		() => onChangePage(currentPage + 1, rowCount),
		[currentPage, onChangePage, rowCount],
	);
	const handleFirst = React.useCallback(() => onChangePage(1, rowCount), [onChangePage, rowCount]);
	const handleLast = React.useCallback(
		() => onChangePage(getNumberOfPages(rowCount, rowsPerPage), rowCount),
		[onChangePage, rowCount, rowsPerPage],
	);
	const handleRowsPerPage = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => onChangeRowsPerPage(Number(e.target.value), currentPage),
		[currentPage, onChangeRowsPerPage],
	);

	const selectOptions = paginationRowsPerPageOptions.map((num: number) => (
		<option key={num} value={num}>
			{num}
		</option>
	));

	if (options.selectAllRowsItem) {
		selectOptions.push(
			<option key={-1} value={rowCount}>
				{options.selectAllRowsItemText}
			</option>,
		);
	}

	const customStyles = useStyles();

	const select = (
		<Select onChange={handleRowsPerPage} defaultValue={rowsPerPage} aria-label={options.rowsPerPageText}>
			{selectOptions}
		</Select>
	);

	const btnClass = (rtl: boolean) =>
		['rdt_paginationButton', rtl && 'rdt_paginationButtonRTL'].filter(Boolean).join(' ');

	return (
		<nav
			className={['rdt_pagination', 'rdt_Pagination'].join(' ')}
			aria-label="Table pagination"
			style={customStyles.pagination?.style}
		>
			{!options.noRowsPerPage && shouldShow && (
				<>
					<span className="rdt_paginationRowLabel">{options.rowsPerPageText}</span>
					{select}
				</>
			)}
			{shouldShow && <span className="rdt_paginationRange">{range}</span>}
			<div className="rdt_paginationPageList">
				<button
					id="pagination-first-page"
					type="button"
					aria-label="First Page"
					aria-disabled={disabledLesser}
					onClick={handleFirst}
					disabled={disabledLesser}
					className={btnClass(isRTL)}
					style={customStyles.pagination?.pageButtonsStyle}
				>
					{icons.first}
				</button>
				<button
					id="pagination-previous-page"
					type="button"
					aria-label="Previous Page"
					aria-disabled={disabledLesser}
					onClick={handlePrevious}
					disabled={disabledLesser}
					className={btnClass(isRTL)}
					style={customStyles.pagination?.pageButtonsStyle}
				>
					{icons.previous}
				</button>
				{!options.noRowsPerPage && !shouldShow && select}
				<button
					id="pagination-next-page"
					type="button"
					aria-label="Next Page"
					aria-disabled={disabledGreater}
					onClick={handleNext}
					disabled={disabledGreater}
					className={btnClass(isRTL)}
					style={customStyles.pagination?.pageButtonsStyle}
				>
					{icons.next}
				</button>
				<button
					id="pagination-last-page"
					type="button"
					aria-label="Last Page"
					aria-disabled={disabledGreater}
					onClick={handleLast}
					disabled={disabledGreater}
					className={btnClass(isRTL)}
					style={customStyles.pagination?.pageButtonsStyle}
				>
					{icons.last}
				</button>
			</div>
		</nav>
	);
}

export default React.memo(Pagination);
