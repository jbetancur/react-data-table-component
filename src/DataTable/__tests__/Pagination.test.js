import 'jest-styled-components';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../test-helpers'; // since child elements require theme
import { DataTableProvider } from '../DataTableContext';
import { defaultProps } from '../propTypes';
import Pagination from '../Pagination';

const defaultStateMock = {
  ...defaultProps,
  paginationComponentOptions: {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  },
};

test('should render correctly with default props', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{ ...defaultStateMock }}>
      <Pagination
        currentPage={1}
        rowsPerPage={10}
        rowCount={40}
        onChangePage={jest.fn()}
        onChangeRowsPerPage={jest.fn()}
      />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

describe('when clicking the First Page button', () => {
  test('should call onChangePage with correct args when currentPage is > 1', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={4}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-first-page'));
    expect(onChangePageMock).toBeCalledWith(1);
  });

  test('should NOT call onChangePage with correct args when currentPage is === 1', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={1}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-first-page'));
    expect(onChangePageMock).not.toBeCalled();
  });
});

describe('when clicking the Last Page button', () => {
  test('should call onChangePage with correct args when currentPage is < the last page', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={1}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-last-page'));
    expect(onChangePageMock).toBeCalledWith(4);
  });

  test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={4}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-last-page'));
    expect(onChangePageMock).not.toBeCalled();
  });
});

describe('when clicking the Next Page button', () => {
  test('should call onChangePage with correct args when currentPage is not the last page', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={1}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).toBeCalledWith(2);
  });

  test('should NOT call onChangePage with correct args when currentPage is the last page', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={4}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).not.toBeCalled();
  });
});

describe('when clicking the Previous Page button', () => {
  test('should call onChangePage with correct args when currentPage is > 1', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={2}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-previous-page'));
    expect(onChangePageMock).toBeCalledWith(1);
  });

  test('should NOT call onChangePage with correct args when currentPage is 1', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={1}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-previous-page'));
    expect(onChangePageMock).not.toBeCalled();
  });
});

describe('when there is no paging to be done', () => {
  test('should NOT call onChangePage with correct with any nav action when there are less rows that the page size', () => {
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={1}
          rowsPerPage={10}
          rowCount={5}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={jest.fn()}
        />
      </DataTableProvider>,
    );

    fireEvent.click(container.querySelector('button#pagination-last-page'));
    expect(onChangePageMock).not.toBeCalled();

    onChangePageMock.mockReset();

    fireEvent.click(container.querySelector('button#pagination-first-page'));
    expect(onChangePageMock).not.toBeCalled();

    onChangePageMock.mockReset();

    fireEvent.click(container.querySelector('button#pagination-previous-page'));
    expect(onChangePageMock).not.toBeCalled();

    onChangePageMock.mockReset();

    fireEvent.click(container.querySelector('button#pagination-next-page'));
    expect(onChangePageMock).not.toBeCalled();
  });
});

describe('when clicking the Previous Page button', () => {
  test('should call onChangePage with correct args when currentPage is > 1', () => {
    const onChangeRowsPerPageMock = jest.fn();
    // TOOO: remove when trailing empty rows is fixed
    const onChangePageMock = jest.fn();
    const { container } = renderWithTheme(
      <DataTableProvider initialState={{ ...defaultStateMock }}>
        <Pagination
          currentPage={2}
          rowsPerPage={10}
          rowCount={40}
          onChangePage={onChangePageMock}
          onChangeRowsPerPage={onChangeRowsPerPageMock}
        />
      </DataTableProvider>,
    );

    fireEvent.change(container.querySelector('select'), { target: { value: 20 } });
    expect(onChangeRowsPerPageMock).toBeCalledWith(20, 2);
  });
});
