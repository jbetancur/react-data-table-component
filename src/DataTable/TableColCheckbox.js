import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTableContext } from "./DataTableContext";
import { CellBase } from "./Cell";
import Checkbox from "./Checkbox";

const TableColStyle = styled(CellBase)`
  flex: 0 0 48px;
  justify-content: center;
  align-items: center;
  user-select: none;
  white-space: nowrap;
`;

const TableColCheckbox = ({ head }) => {
  const {
    dispatch,
    data,
    selectedRows,
    allSelected,
    selectableRowsComponent,
    selectableRowsComponentProps,
    selectableRowDisabled,
    keyField,
    mergeSelections,
    showSelectAllOverride,
  } = useTableContext();
  const indeterminate = selectedRows.length > 0 && !allSelected;
  const rows = selectableRowDisabled
    ? data.filter((row) => !selectableRowDisabled(row))
    : data;
  const isDisabled = rows.length === 0;
  const rowCount = data.length;

  var selectAllOverride = false;
  if (showSelectAllOverride) {
    if (!selectedRows.length == 0) {
      for (var i = 0; i < data.length; i++) {
        let selected = selectedRows.some((item) => {
          if (data[i]) {
            return item._id === data[i]._id;
          }
          return false;
        });
        if (!selected) {
          selectAllOverride = false;
          break;
        }
      }
    }
  }

  const handleSelectAll = useCallback(
    () =>
      dispatch({
        type: "SELECT_ALL_ROWS",
        rows,
        rowCount,
        mergeSelections,
        keyField,
      }),
    [dispatch, keyField, mergeSelections, rowCount, rows]
  );

  return (
    <TableColStyle className="rdt_TableCol" head={head} noPadding>
      <Checkbox
        name="select-all-rows"
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        onClick={handleSelectAll}
        checked={showSelectAllOverride ? selectAllOverride : allSelected}
        indeterminate={indeterminate}
        disabled={isDisabled}
      />
    </TableColStyle>
  );
};

TableColCheckbox.propTypes = {
  head: PropTypes.bool,
};

TableColCheckbox.defaultProps = {
  head: true,
};
export default TableColCheckbox;
