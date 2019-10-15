import React from 'react';
import styled from 'styled-components';
import DropDownIcon from '../icons/Dropdown';

const SelectControl = styled.select`
  cursor: pointer;
  height: 24px;
  min-width: 24px;
  user-select: none;
  padding-left: 8px;
  padding-right: 12px;
  box-sizing: content-box;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};
  outline: none;
  border: none;
  background-color: transparent;
  appearance: none;
  direction: ltr;

  &::-ms-expand {
    display: none;
  }

  &:disabled::-ms-expand {
    background: #f60;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};

  svg {
    top: 0;
    right: 0;
    color: ${props => props.theme.pagination.fontColor};
    position: absolute;
    fill: currentColor;
    width: 24px;
    height: 24px;
    display: inline-block;
    user-select: none;
    pointer-events: none;
  }
`;

const Select = props => (
  <SelectWrapper>
    <SelectControl {...props} />
    <DropDownIcon />
  </SelectWrapper>
);

export default Select;
