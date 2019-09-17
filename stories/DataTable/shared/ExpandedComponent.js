import React from 'react';

// eslint-disable-next-line react/prop-types
export default ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;
