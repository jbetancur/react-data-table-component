import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';

export const defaultState = {
  keyField: 'id',
  columns: [],
  rows: [],
  selectedRows: [],
  internalCell: false,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
};

const DataTableContext = createContext(defaultState);

export class DataTableProvider extends PureComponent {
  static propTypes = {
    initialState: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  render() {
    const { children, initialState } = this.props;

    return (
      <DataTableContext.Provider value={initialState}>
        {children}
      </DataTableContext.Provider>
    );
  }
}

export const DataTableConsumer = DataTableContext.Consumer;
