import React from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';

const SchemaFieldItem = ({ field, checked, onToggle, viewOnly = false }) => {
  return (
    <ListItem>
      {viewOnly ? (
        <ListItemText primary={typeof field === 'object' && field !== null ? field.field : field} />
      ) : (
        <>
          <Checkbox
            checked={checked}
            onChange={() => onToggle(field)}
            edge="start"
            size="small"
          />
          <ListItemText primary={typeof field === 'object' && field !== null ? field.field : field} />
        </>
      )}
    </ListItem>
  );
};

export default SchemaFieldItem;
