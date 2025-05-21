import React from 'react';
import { Handle } from 'reactflow';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

// Define the SchemaBox component
const SchemaBox = ({ data }) => {
  const { schema = [], label = 'Schema Node' } = data;

  return (
    <Box
      sx={{
        padding: 2,
        border: '2px solid #4caf50',
        borderRadius: 2,
        backgroundColor: '#e8f5e9',
        minWidth: 200,
        position: 'relative',
      }}
    >
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Typography variant="body2" color="textSecondary">
        Fields:
      </Typography>
      <List dense disablePadding>
        {schema.map((field, index) => (
          <ListItem key={index}>
            <ListItemText primary={field} />
          </ListItem>
        ))}
      </List>

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default SchemaBox;
