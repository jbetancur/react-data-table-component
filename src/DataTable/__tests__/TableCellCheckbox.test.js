import 'jest-styled-components';
import React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import { DataTableProvider, defaultState } from '../DataTableContext';
import TableCellCheckbox from '../TableCellCheckbox';

const columnsMock = [{
  id: 123,
  name: 'Name',
  selector: 'name',
}];

const rowMock = {
  id: 456, name: 'testname',
};

// eslint-disable-next-line react/prefer-stateless-function
const CustomCheckboxComponent = class extends React.Component {
  render() {
    return (
      <div>hahah</div>
    );
  }
};

afterEach(cleanup);

test('should render correctly', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
    }}
    >
      <TableCellCheckbox row={rowMock} column={{ selector: 'name' }} onClick={jest.fn()} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly if a selectableRowsComponent is provided', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectableRowsComponent: CustomCheckboxComponent,
    }}
    >
      <TableCellCheckbox row={rowMock} column={{ selector: 'name' }} onClick={jest.fn()} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should render correctly if a selectableRowsComponent is provided with selectableRowsComponentProps', () => {
  const { container } = renderWithTheme(
    <DataTableProvider initialState={{
      ...defaultState,
      columns: columnsMock,
      selectableRowsComponent: CustomCheckboxComponent,
      selectableRowsComponentProps: { tasty: true },
    }}
    >
      <TableCellCheckbox row={rowMock} column={{ selector: 'name' }} onClick={jest.fn()} />
    </DataTableProvider>,
  );

  expect(container.firstChild).toMatchSnapshot();
});
