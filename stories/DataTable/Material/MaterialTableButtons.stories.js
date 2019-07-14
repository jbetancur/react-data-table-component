
import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import differenceBy from 'lodash/differenceBy';
import 'react-md/dist/react-md.pink-blue.min.css';
import { Card, Button, FontIcon, Checkbox } from 'react-md';
import tableDataItems from '../constants/sampleDeserts';
import CustomMaterialMenu from './CustomMaterialMenu';
import DataTable from '../../../src/DataTable/DataTable';
import './index.css';

class MaterialTable extends PureComponent {
  state = { selectedRows: [], toggleCleared: false, data: tableDataItems };

  handleChange = state => {
    // eslint-disable-next-line no-console
    console.log('state ', state);
    this.setState({ selectedRows: state.selectedRows });
  };

  handleRowClicked = row => {
    // eslint-disable-next-line no-console
    console.log(`${row.name} was clicked!`);
  }

  deleteAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.name);
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
      this.setState(state => ({ toggleCleared: !state.toggleCleared, data: differenceBy(state.data, state.selectedRows, 'name') }));
    }
  }

  deleteOne = row => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete:\r ${row.name}?`)) {
      const { data } = this.state;
      const index = data.findIndex(r => r === row);

      this.setState(state => ({
        toggleCleared: !state.toggleCleared,
        data: [...state.data.slice(0, index), ...state.data.slice(index + 1)],
      }));
    }
  }

  render() {
    const actions = [
      <Button key="add" flat secondary iconChildren="add">Add</Button>,
    ];

    const contextActions = [
      <Button key="delete" onClick={this.deleteAll} style={{ color: 'red' }} icon>delete</Button>,
    ];

    const columns = [
      {
        cell: row => <CustomMaterialMenu row={row} onDeleteRow={this.deleteOne} />,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '56px', // custom width for icon button
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
      {
        cell: () => <Button raised primary>Action</Button>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];

    const { data, toggleCleared } = this.state;

    return (
      <Card style={{ height: '100%' }}>
        <DataTable
          title="Desserts"
          columns={columns}
          data={data}
          selectableRows
          highlightOnHover
          defaultSortField="name"
          actions={actions}
          contextActions={contextActions}
          sortIcon={<FontIcon>arrow_downward</FontIcon>}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{ uncheckedIcon: isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>) }}
          onTableUpdate={this.handleChange}
          clearSelectedRows={toggleCleared}
          onRowClicked={this.handleRowClicked}
          pagination
        />
      </Card>
    );
  }
}

storiesOf('UI Libraries', module)
  .add('react-md: Action Buttons', () => <MaterialTable />);
