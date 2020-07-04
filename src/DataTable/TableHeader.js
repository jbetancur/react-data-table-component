import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';

const TableHeaderStyle = styled.header`
  position: relative;
  box-sizing: border-box;
  overflow: visible;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  ${props => props.theme.header.style}
`;

const Title = styled.div`
  flex: 1 0 auto;
  color: ${props => props.theme.header.fontColor};
  font-size: ${props => props.theme.header.fontSize};
  font-weight: 400;
`;

const Actions = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > * {
    margin-left: 5px;
  }
`;

const TableHeader = ({ title, actions, showMenu }) => (
  <TableHeaderStyle className="rdt_TableHeader" role="rowheader">
    <Title>
      {title}
    </Title>

    <Actions>
      {actions}
    </Actions>

    {showMenu && <ContextMenu />}
  </TableHeaderStyle>
);

TableHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  showMenu: PropTypes.bool,
};

TableHeader.defaultProps = {
  actions: [],
  showMenu: true,
};

export default TableHeader;
