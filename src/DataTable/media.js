import { css } from 'styled-components';

export const XSMALL = 320;
export const SMALL = 599;
export const MEDIUM = 959;
export const LARGE = 1280;

export const media = {
  xs: (...args) => css`
  @media screen and (max-width: ${XSMALL}px) {
    ${css(...args)}
  }
`,
  sm: (...args) => css`
    @media screen and (max-width: ${SMALL}px) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media screen and (max-width: ${MEDIUM}px) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media screen and (max-width: ${LARGE}px) {
      ${css(...args)}
    }
  `,
  custom: value => (...args) => css`
    @media screen and (max-width: ${value}px) {
      ${css(...args)}
    }
  `,
};
