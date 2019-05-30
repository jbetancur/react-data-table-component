import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';

const TableHeaderStyle = styled.header`
  position: relative;
  overflow: visible;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px 4px 24px;
  min-height: ${props => props.theme.title.height};
  width: 100%;
  background-color: ${props => props.theme.title.backgroundColor};
  flex-wrap: wrap;
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
  align-items: center;
  justify-content: flex-end;

  > * {
    margin-left: 5px;
  }
`;

const TableHeader = ({ title, actions }) => (
  <TableHeaderStyle className="rdt_TableHeader">
    <Title>
      {title}
    </Title>

    <Actions>
      {actions}
    </Actions>

    <ContextMenu />
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
};

TableHeader.defaultProps = {
  actions: [],
};

export default TableHeader;
