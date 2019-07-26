
import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import tableDataItems from '../constants/sampleDeserts';
import DataTable, { memoize } from '../../../src/index';

const columns = memoize(clickHandler => [
  {
    // eslint-disable-next-line react/button-has-type
    cell: () => <button raised primary onClick={clickHandler}>Action</button>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    grow: 2,
  },
  {
    name: 'Type',
    selector: 'type',
    sortable: true,
  },
  {
    name: 'Calories (g)',
    selector: 'calories',
    sortable: true,
    right: true,
  },
  {
    name: 'Fat (g)',
    selector: 'fat',
    sortable: true,
    right: true,
  },
  {
    name: 'Carbs (g)',
    selector: 'carbs',
    sortable: true,
    right: true,
  },
  {
    name: 'Protein (g)',
    selector: 'protein',
    sortable: true,
    right: true,
  },
  {
    name: 'Sodium (mg)',
    selector: 'sodium',
    sortable: true,
    right: true,
  },
  {
    name: 'Calcium (%)',
    selector: 'calcium',
    sortable: true,
    right: true,
  },
  {
    name: 'Iron (%)',
    selector: 'iron',
    sortable: true,
    right: true,
  },
]);

class OptimizedClass extends PureComponent {
  state = {
    // eslint-disable-next-line react/no-unused-state
    selectedRows: [],
  };

  handleButtonClick = () => {
    // eslint-disable-next-line no-console
    console.log('clicked');
  }

  handleChange = state => {
    // eslint-disable-next-line no-console
    console.log('state', state.selectedRows);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedRows: state.selectedRows });
  }

  render() {
    return (
      <DataTable
        title="Desserts"
        data={tableDataItems}
        columns={columns(this.handleButtonClick)}
        onTableUpdate={this.handleChange}
        selectableRows
      />
    );
  }
}

storiesOf('Basic', module)
  .add('Optimized: Class', () => <OptimizedClass />);
