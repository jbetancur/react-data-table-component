/**
 * @jest-environment jsdom
 */

import 'jest-styled-components';
import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../internal/test-helpers'; // since child elements require theme
import Pagination from '../Pagination';

test('should render correctly with default props', () => {
	const { container } = renderWithTheme(
		<Pagination
			currentPage={1}
			rowsPerPage={10}
			rowCount={40}
			onChangePage={jest.fn()}
			onChangeRowsPerPage={jest.fn()}
		/>,
	);

	expect(container.firstChild).toMatchSnapshot();
});

describe('when clicking the First Page button', () => {
	test('should call onChangePage with correct args when currentPage is > 1', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(1);
	});

	test('should NOT call onChangePage with correct args when currentPage is === 1', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-first-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Last Page button', () => {
	test('should call onChangePage with correct args when currentPage is < the last page', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(4);
	});

	test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-last-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Next Page button', () => {
	test('should call onChangePage with correct args when currentPage is not the last page', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(2);
	});

	test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={4}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-next-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when clicking the Previous Page button', () => {
	test('should call onChangePage with correct args when currentPage is > 1', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={2}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).toBeCalledWith(1);
	});

	test('should NOT call onChangePage with correct args when currentPage is 1', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
			/>,
		);

		fireEvent.click(container.querySelector('button#pagination-previous-page') as HTMLButtonElement);
		expect(onChangePageMock).not.toBeCalled();
	});
});

describe('when there is no paging to be done', () => {
	test('should NOT call onChangePage with correct with any nav action when there are less rows that the page size', () => {
		const onChangePageMock = jest.fn();
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={5}
				onChangePage={onChangePageMock}
				onChangeRowsPerPage={jest.fn()}
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

describe('when clicking the Previous Page button', () => {
	test('should call onChangePage with correct args when currentPage is > 1', () => {
		const onChangeRowsPerPageMock = jest.fn();
		// TOOO: remove when trailing empty rows is fixed
		const onChangePageMock = jest.fn();
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

describe('when the screensize is small', () => {
	test('paginationComponentOption noRowsPerPage should be respected', () => {
		global.innerWidth = 500;
		const { container } = renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={jest.fn()}
				onChangeRowsPerPage={jest.fn()}
				paginationComponentOptions={{
					noRowsPerPage: true,
				}}
			/>,
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});

describe('Pagination component accessibility labels', () => {
	test('should render custom aria-labels for navigation buttons', () => {
		global.innerWidth = 500;

		renderWithTheme(
			<Pagination
				currentPage={1}
				rowsPerPage={10}
				rowCount={40}
				onChangePage={jest.fn()}
				onChangeRowsPerPage={jest.fn()}
				paginationComponentOptions={{
					firstPageLabel: 'Primeira página',
					lastPageLabel: 'Última página',
					nextPageLabel: 'Próxima página',
					previousPageLabel: 'Página anterior',
				}}
			/>,
		);

		const firstPageButton = screen.getByRole('button', { name: /Primeira página/i });
		const lastPageButton = screen.getByRole('button', { name: /Última página/i });
		const nextPageButton = screen.getByRole('button', { name: /Próxima página/i });
		const previousPageButton = screen.getByRole('button', { name: /Página anterior/i });

		expect(firstPageButton).not.toBeNull();
		expect(firstPageButton.getAttribute('aria-label')).toBe('Primeira página');

		expect(lastPageButton).not.toBeNull();
		expect(lastPageButton.getAttribute('aria-label')).toBe('Última página');

		expect(nextPageButton).not.toBeNull();
		expect(nextPageButton.getAttribute('aria-label')).toBe('Próxima página');

		expect(previousPageButton).not.toBeNull();
		expect(previousPageButton.getAttribute('aria-label')).toBe('Página anterior');
	});
});
