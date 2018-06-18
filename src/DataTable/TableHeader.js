import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import ContextMenu from './ContextMenu';

const TableHeaderStyle = styled.header`
  position: relative;
  overflow: visible;
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 24px;
  min-height: 64px;
  width: 100%;
`;

const Title = styled.div`
  flex: 1 0 auto;
  color: ${props => props.theme.title.fontColor};
  font-size: ${props => props.theme.title.fontSize};
  font-weight: 400;
`;

const Actions = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  > * {
    margin-left: 5px;
  }
`;

const TableHeader = ({ title, showContextMenu, contextTitle, actions, contextActions }) => (
  <TableHeaderStyle>
    <Title>
      {title}
    </Title>

    <Actions>
      {actions}
    </Actions>

    <ContextMenu
      visible={showContextMenu}
      title={contextTitle}
      contextActions={contextActions}
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
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  contextActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

TableHeader.defaultProps = {
  showContextMenu: false,
  contextTitle: '',
  actions: [],
  contextActions: [],
};

export default withTheme(TableHeader);
