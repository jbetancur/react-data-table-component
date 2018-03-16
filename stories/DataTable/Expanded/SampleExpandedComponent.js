import React, { PureComponent } from 'react';

/* eslint-disable */
export default class Sample extends PureComponent {
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props.data, null, 2)}</pre>
      </div>
    );
  }
}
