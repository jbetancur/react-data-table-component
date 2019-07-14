import { css } from 'styled-components';

export const media = {
  sm: (...args) => css`
    @media screen and (max-width: 599px) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media screen and (max-width: 959px) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media screen and (max-width: 1280px) {
      ${css(...args)}
    }
  `,
  custom: value => (...args) => css`
    @media screen and (max-width: ${value}px) {
      ${css(...args)}
    }
  `,
};
