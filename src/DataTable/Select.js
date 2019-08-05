import React from 'react';
import styled from 'styled-components';
import DropDownIcon from '../icons/Dropdown';

const SelectControl = styled.select`
  cursor: pointer;
  height: 24px;
  min-width: 24px;
  user-select: none;
  padding-left: 8px;
  padding-right: 16px;
  box-sizing: content-box;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};
  outline: none;
  border: none;
  background-color: transparent;
  appearance: none;

  &::-ms-expand {
    display: none;
  }

  &:disabled::-ms-expand {
    background: #f60;
  }
`;

const SelectWrapper = styled.div`
  /* width: 100%; */
  position: relative;
  flex-shrink: 0;
  margin-left: 8px;
  margin-right: 32px;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};

  svg {
    top: 1px;
    right: 0;
    color: ${props => props.theme.pagination.fontColor};
    position: absolute;
    pointer-events: none;
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 24px;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    user-select: none;
    flex-shrink: 0;
  }
`;

const Select = props => (
  <SelectWrapper>
    <SelectControl {...props} />
    <DropDownIcon />
  </SelectWrapper>
);

export default Select;
