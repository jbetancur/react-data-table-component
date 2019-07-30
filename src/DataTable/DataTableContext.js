import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const DataTableStateContext = createContext();
export const useTableContext = () => useContext(DataTableStateContext);

export const DataTableProvider = ({ children, initialState }) => (
  <DataTableStateContext.Provider value={initialState}>
    {children}
  </DataTableStateContext.Provider>
);

DataTableProvider.propTypes = {
  initialState: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
