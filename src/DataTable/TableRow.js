import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';

const defaultRowsCSS = css`
  border-top: ${props => props.theme.rows.borderWidth} solid ${props => props.theme.rows.borderColor};
`;

const spacedRowsCSS = css`
  margin-top: ${props => props.theme.rows.spacingMargin || 0};
  margin-bottom: ${props => props.theme.rows.spacingMargin || 0};
  border-radius: ${props => props.theme.rows.spacingBorderRadius || 0};
  border: ${props => props.theme.rows.borderWidth} solid ${props => props.theme.rows.borderColor};
  ${props => props.theme.rows.spacingShadow && `box-shadow: ${props.theme.rows.spacingShadow}`};
`;

const stripedCSS = css`
  &:nth-child(odd) {
    background-color: ${props => props.theme.rows.stripedColor};
  }
`;

const hightlightCSS = css`
  &:hover {
    color: ${props => props.theme.rows.hoverFontColor};
    background-color: ${props => props.theme.rows.hoverColor};
    transition-duration: 0.15s;
    transition-property: background-color;
  }
`;

const pointerCSS = css`
  &:hover {
    cursor: pointer;
  }
`;

const TableRowStyle = styled.div`
  display: flex;
  width: 100%;
  ${props => (props.theme.rows.spacing === 'spaced' ? spacedRowsCSS : defaultRowsCSS)};
  background-color: ${props => props.theme.rows.backgroundColor};
  color: ${props => props.theme.rows.fontColor};
  ${props => props.striped && stripedCSS};
  ${props => props.highlightOnHover && hightlightCSS};
  ${props => props.pointerOnHover && pointerCSS};
`;

class TableRow extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    onRowClicked: PropTypes.func.isRequired,
    onRowSelected: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
  }

  handleRowSelected = row => {
    const { onRowSelected } = this.props;

    onRowSelected(row);
  }

  handleRowClick = e => {
    // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
    if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
      const { onRowClicked, row } = this.props;

      onRowClicked(row, e);
    }
  };

  isChecked = (row, selectedRows) => selectedRows.some(srow => srow === row);

  toggleRowExpand = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  render() {
    const {
      row,
      onRowClicked,
    } = this.props;

    const { expanded } = this.state;

    return (
      <DataTableConsumer>
        {({ keyField, columns, selectedRows, selectableRows, expandableRows, striped, highlightOnHover, pointerOnHover, expandableRowsComponent }) => (
          <React.Fragment>
            <TableRowStyle
              striped={striped}
              highlightOnHover={highlightOnHover}
              pointerOnHover={pointerOnHover}
              onClick={this.handleRowClick}
            >
              {selectableRows && (
                <TableCellCheckbox
                  checked={this.isChecked(row, selectedRows)}
                  onClick={this.handleRowSelected}
                  row={row}
                />
              )}

              {expandableRows && (
                <TableCellExpander
                  expanded={expanded}
                  row={row}
                  onExpandToggled={this.toggleRowExpand}
                />
              )}

              {columns.map(column => (
                <TableCell
                  type="cell"
                  key={`cell-${column.id}-${row[keyField]}`}
                  column={column}
                  row={row}
                  rowClickable={!!onRowClicked || column.button}
                />
              ))}
            </TableRowStyle>

            {expanded && (
              <ExpanderRow
                key={`expander--${row[keyField]}`}
                data={row}
              >
                {expandableRowsComponent}
              </ExpanderRow>
            )}
          </React.Fragment>
        )}
      </DataTableConsumer>
    );
  }
}

export default TableRow;
