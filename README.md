[![npm version](https://badge.fury.io/js/react-data-table-component.svg)](https://badge.fury.io/js/react-data-table-component) [![codecov](https://codecov.io/gh/jbetancur/react-data-table-component/branch/master/graph/badge.svg)](https://codecov.io/gh/jbetancur/react-data-table-component)

## Documentation Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/26e0d16d-a986-46b1-9097-1a76c10d7cad/deploy-status)](https://app.netlify.com/sites/react-data-table-component/deploys)

The documentation contains information about installation and usage.

https://react-data-table-component.netlify.app

## Custom Cells

Let's give our Movie list a summary, but in the same cell as `Name`:

```js
....

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div data-tag="allowRowEvents"><div style={{ fontWeight: bold }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onSelectedRowsChange={handleChange}
      />
    )
  }
};
```

## Expandable Rows

Let's make our rows expandable so we can view more details:

```js
...

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 700 }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

// The row data is composed into your custom expandable component via the data prop
const ExpandableComponent = ({ data }) => <img src={data.image} />;

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onSelectedRowsChange={handleChange}
        expandableRows
        expandableRowsComponent={ExpandableComponent}
      />
    )
  }
};
```

But in some cases we don't have more details to show:

```js
...

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', expanderDisabled: true, image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 700 }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

// The row data is composed into your custom expandable component via the data prop
const ExpandableComponent = ({ data }) => <img src={data.image} />;

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onSelectedRowsChange={handleChange}
        expandableRows
        expandableRowDisabled={row => row.disabled}
        expandableRowsComponent={ExpandableComponent}
      />
    )
  }
};
```

## UI Library Integration

React Data Table Component makes it easy to incorporate ui components from other libraries for overriding things like the sort icon, select checkbox.

- [MaterialUI](https://codesandbox.io/s/react-data-table-materialui-72gdo)
- [Bootstrap 4](https://codesandbox.io/s/react-data-table-sandbox-z6gtg)

# Contributors

Thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/jbetancur/react-data-table-component/graphs/contributors"><img src="https://opencollective.com/react-data-table-component/contributors.svg?width=890" /></a>
