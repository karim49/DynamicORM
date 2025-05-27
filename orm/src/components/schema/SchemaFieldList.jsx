import React from 'react';
import { List, Box } from '@mui/material';
import SchemaFieldItem from './SchemaFieldItem';

const SchemaFieldList = ({ fields, checked, onToggle, viewOnly = false }) => {
  return (
    <List dense disablePadding>
      {fields.map((field, index) => (
        <Box key={index} sx={{ mb: -2 }}>
          <SchemaFieldItem
            key={index}
            field={field}
            checked={checked.includes(field)}
            onToggle={onToggle}
            viewOnly={viewOnly}
          />
        </Box>
      ))}
    </List>
  );
};

export default SchemaFieldList;
