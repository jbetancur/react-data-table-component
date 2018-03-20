import React from 'react';
import styled from 'styled-components';

const SampleStyle = styled.div`
  padding: 16px;
  display: block;
  width: 100%;

  p {
    font-size: 16px;
    font-weight: 700;
    word-break: break-all;
  }
`;

// eslint-disable-next-line
export default ({ data }) => (
  <SampleStyle>
    <p>
      {data.summary}
    </p>
    <img height="75%" width="75%" alt={data.image.original} src={data.image.original} />
  </SampleStyle>
);
