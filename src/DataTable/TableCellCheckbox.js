import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import Checkbox from './Checkbox';

const TableCellCheckboxStyle = styled.div`
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  box-sizing: border-box;
  line-height: normal;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
`;

class TableCellCheckbox extends PureComponent {
  static propTypes = {
    row: PropTypes.object,
    checked: PropTypes.bool,
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    row: {},
    checkboxComponent: null,
    checked: false,
    checkboxComponentOptions: {},
    onClick: null,
  };

  handleCellClick = e => {
    e.stopPropagation();
  };

  render() {
    const {
      checkboxComponent,
      checkboxComponentOptions,
      checked,
      row,
      onClick,
    } = this.props;

    return (
      <TableCellCheckboxStyle
        onClick={this.handleCellClick}
      >
        <Checkbox
          name="select-row"
          aria-label="select-row"
          component={checkboxComponent}
          componentOptions={checkboxComponentOptions}
          checked={checked}
          onClick={onClick}
          data={row}
        />
      </TableCellCheckboxStyle>
    );
  }
}

export default withTheme(TableCellCheckbox);
