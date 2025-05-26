import React from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';

const SchemaFieldItem = ({ field, checked, onToggle }) => {
  return (
    <ListItem >
      <Checkbox
        checked={checked}
        onChange={() => onToggle(field)}
        edge="start"
        size="small"
      />
      <ListItemText primary={field} />
    </ListItem>
  );
};

export default SchemaFieldItem;
