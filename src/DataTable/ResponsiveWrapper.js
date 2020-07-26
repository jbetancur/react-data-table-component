import styled, { css } from 'styled-components';

/* Hack when using layovers/menus that get clipped by overflow-x
  when a table is responsive due to overflow-xy scroll spec stupidity.
  Note: The parent element height must be set to 100%!
  https://www.brunildo.org/test/Overflowxy2.html
*/

const ResponsiveWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: inherit;
  ${props => props.responsive && css`
    overflow-x: auto;

    // prevents vertical scrolling in firefox
    overflow-y: hidden;
    min-height: 0;
  `};
  ${props => props.overflowY && props.responsive && props.overflowYOffset && css`
    padding-bottom: ${props.overflowYOffset};
    margin-bottom: -${props.overflowYOffset};
  `};
`;

export default ResponsiveWrapper;
