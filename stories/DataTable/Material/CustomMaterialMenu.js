import React from 'react';
import { FontIcon, MenuButton, ListItem, Divider } from 'react-md';


// eslint-disable-next-line react/prop-types
export default ({ row }) => {
  const deleteRow = () => {
    // eslint-disable-next-line no-console
    console.log(`deleted ${row.id}!`);
    // eslint-disable-next-line no-alert
    window.alert(`deleted ${row.name}!`);
  };

  return (
    <MenuButton
      id="menu-button-2"
      icon
      menuItems={[
        <ListItem key={1} primaryText="Item One" />,
        <ListItem key={2} primaryText="Item Two" />,
        <Divider key={3} />,
        <ListItem key={4} primaryText="Delete" leftIcon={<FontIcon style={{ color: 'red' }}>delete</FontIcon>} onClick={deleteRow} />,
      ]}
      centered
    >
      more_vert
    </MenuButton>
  );
};
