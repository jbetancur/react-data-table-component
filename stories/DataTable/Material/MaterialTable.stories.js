
import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import 'react-md/dist/react-md.pink-blue.min.css';
import differenceBy from 'lodash/differenceBy';
import { Card, Button, FontIcon, Checkbox } from 'react-md';
import data from '../constants/sampleDeserts';
import CustomMaterialMenu from './CustomMaterialMenu';
import DataTable from '../../../src/DataTable/DataTable';
import './index.css';

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
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
    number: true,
  },
  {
    name: 'Fat (g)',
    selector: 'fat',
    sortable: true,
    number: true,
  },
  {
    name: 'Carbs (g)',
    selector: 'carbs',
    sortable: true,
    number: true,
  },
  {
    name: 'Protein (g)',
    selector: 'protein',
    sortable: true,
    number: true,
  },
  {
    name: 'Sodium (mg)',
    selector: 'sodium',
    sortable: true,
    number: true,
  },
  {
    name: 'Calcium (%)',
    selector: 'calcium',
    sortable: true,
    number: true,
  },
  {
    name: 'Iron (%)',
    selector: 'iron',
    sortable: true,
    number: true,
  },
  {
    name: 'Actions',
    width: '42px',
    cell: row => <CustomMaterialMenu row={row} />,
    ignoreRowClick: true,
  },
];


class MaterialTable extends PureComponent {
  state = { selectedRows: [], clearSelected: false, data };

  handleChange = state => {
    // eslint-disable-next-line no-console
    console.log('state ', state);
    this.setState({ selectedRows: state.selectedRows, clearSelected: false });
  };

  handleRowClicked = row => {
    // eslint-disable-next-line no-console
    console.log(`${row.name} was clicked!`);
  }

  deleteAll = () => {
    const rows = this.state.selectedRows.map(r => r.name);
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you wamt to delete:\r ${rows}?`)) {
      this.setState(state => ({ clearSelected: true, data: differenceBy(state.data, state.selectedRows, 'name') }));
    }
  }

  render() {
    const contextActions = [
      <Button key="add" icon secondary>add</Button>,
      <Button key="delete" onClick={this.deleteAll} style={{ color: 'red' }} icon>delete</Button>,
    ];

    return (
      <Card style={{ height: '100%' }}>
        <DataTable
          overflowY
          title="Desserts"
          columns={columns}
          data={this.state.data}
          selectableRows
          highlightOnHover
          defaultSortField="name"
          contextActions={contextActions}
          sortIcon={<FontIcon>arrow_downward</FontIcon>}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{ uncheckedIcon: isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>) }}
          onTableUpdate={this.handleChange}
          clearSelectedRows={this.state.clearSelected}
          onRowClicked={this.handleRowClicked}
        />
      </Card>
    );
  }
}

storiesOf('React Data Table', module).add('Material (3rd Party UI Lib)', () => <MaterialTable />);
