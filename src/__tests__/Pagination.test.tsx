/**
 *
 */

import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from './test-helpers'; // since child elements require theme
import Pagination from '../components/Pagination';

test('should render correctly with default props', () => {
	const { container } = renderWithTheme(
		<Pagination currentPage={1} rowsPerPage={10} rowCount={40} onChangePage={vi.fn()} onChangeRowsPerPage={vi.fn()} />,
	);

	expect(container.querySelector('button#pagination-first-page')).not.toBeNull();
	expect(container.querySelector('button#pagination-last-page')).not.toBeNull();
});

describe('when clicking the First Page button', () => {
	test('should call onChangePage with correct args when currentPage is > 1', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(1, 40);
	});

	test('should NOT call onChangePage with correct args when currentPage is === 1', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Last Page button', () => {
	test('should call onChangePage with correct args when currentPage is < the last page', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(4, 40);
	});

	test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Next Page button', () => {
	test('should call onChangePage with correct args when currentPage is not the last page', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(2, 40);
	});

	test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Previous Page button', () => {
	test('should call onChangePage with correct args when currentPage is > 1', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={2}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(1, 40);
	});

	test('should NOT call onChangePage with correct args when currentPage is 1', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when there is no paging to be done', () => {
	test('should NOT call onChangePage with correct with any nav action when there are less rows that the page size', () => {
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={5}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={vi.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();

		onChangePageMock.mockReset();

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();

		onChangePageMock.mockReset();

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();

		onChangePageMock.mockReset();

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when changing rows per page', () => {
	test('should call onChangeRowsPerPage with the new perPage and current page', () => {
		const onChangeRowsPerPageMock = vi.fn();
		const onChangePageMock = vi.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={2}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={onChangeRowsPerPageMock}
			/>,
		);

		fireEvent.change(container.querySelector('select') as HTMLSelectElement, { target: { value: 20 } });
		expect(onChangeRowsPerPageMock).toBeCalledWith(20, 2);
	});
});

describe('Pagination:localization', () => {
	const localization = {
		navigationAriaLabel: 'test-nav',
		firstPageAriaLabel: 'test-first',
		previousPageAriaLabel: 'test-prev',
		nextPageAriaLabel: 'test-next',
		lastPageAriaLabel: 'test-last',
	};

	test('navigation nav uses custom navigationAriaLabel', () => {
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				localization={localization}
			/>,
		);
		expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe('test-nav');
	});

	test('first-page button uses custom firstPageAriaLabel', () => {
		const { container } = renderWithTheme(
			<Pagination
				currentPage={2}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				localization={localization}
			/>,
		);
		expect(container.querySelector('#pagination-first-page')?.getAttribute('aria-label')).toBe('test-first');
	});

	test('previous-page button uses custom previousPageAriaLabel', () => {
		const { container } = renderWithTheme(
			<Pagination
				currentPage={2}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				localization={localization}
			/>,
		);
		expect(container.querySelector('#pagination-previous-page')?.getAttribute('aria-label')).toBe('test-prev');
	});

	test('next-page button uses custom nextPageAriaLabel', () => {
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				localization={localization}
			/>,
		);
		expect(container.querySelector('#pagination-next-page')?.getAttribute('aria-label')).toBe('test-next');
	});

	test('last-page button uses custom lastPageAriaLabel', () => {
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				localization={localization}
			/>,
		);
		expect(container.querySelector('#pagination-last-page')?.getAttribute('aria-label')).toBe('test-last');
	});
});

describe('when the screensize is small', () => {
	test('paginationComponentOption noRowsPerPage should be respected', () => {
		globalThis.innerWidth = 500;
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={vi.fn()}
				onChangeRowsPerPage={vi.fn()}
				paginationComponentOptions={{
					noRowsPerPage: true,
				}}
			/>,
		);

		expect(container.querySelector('select')).toBeNull();
	});
});
