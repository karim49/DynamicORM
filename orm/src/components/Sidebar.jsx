import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const dataBlocks = [
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'sql', label: 'SQL' },
  { id: 'file', label: 'File' }
];

const Sidebar = () => {
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('application/my-app', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        width: 220,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Data Sources
      </Typography>
      {dataBlocks.map((block) => (
        <Paper
          key={block.id}
          elevation={2}
          sx={{
            p: 1.5,
            mb: 1.5,
            cursor: 'grab',
            userSelect: 'none',
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragEnd={(e) => e.preventDefault()}
        >
          {block.label}
        </Paper>
      ))}
    </Box>
  );
};

export default Sidebar;
