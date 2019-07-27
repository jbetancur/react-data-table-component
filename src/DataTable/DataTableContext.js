import React, { PureComponent, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const DataTableStateContext = createContext();
export const useTableContext = () => useContext(DataTableStateContext);

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
      <DataTableStateContext.Provider value={initialState}>
        {children}
      </DataTableStateContext.Provider>
    );
  }
}
