import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import ContextMenu from './ContextMenu';

const TableHeaderStyle = styled.header`
  position: relative;
  overflow: hidden;
  align-items: center;
  display: flex;
  padding: 16px;
  min-height: 64px;
`;

const Title = styled.div`
  color: ${props => props.theme.title.fontColor};
  font-size: ${props => props.theme.title.fontSize};
  font-weight: 400;
`;

const TableHeader = ({ title, showContextMenu, contextTitle, contextActions }) => (
  <TableHeaderStyle>
    <Title>
      {title}
    </Title>

    <ContextMenu
      visible={showContextMenu}
      title={contextTitle}
      actions={contextActions}
    />
  </TableHeaderStyle>
);

TableHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  showContextMenu: PropTypes.bool,
  contextTitle: PropTypes.string,
  contextActions: PropTypes.array,
};

TableHeader.defaultProps = {
  showContextMenu: false,
  contextTitle: '',
  contextActions: [],
};

export default withTheme(TableHeader);
