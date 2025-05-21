import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sourceMeta } from '../lib/sourceMeta';



const Sidebar = () => {
  const categorizedBlocks = {};

  Object.entries(sourceMeta).forEach(([key, meta]) => {
    if (!categorizedBlocks[meta.category]) {
      categorizedBlocks[meta.category] = [];
    }
    categorizedBlocks[meta.category].push({ id: key, label: meta.label });
  });

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('application/my-app', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Data Sources
      </Typography>

      {Object.entries(categorizedBlocks).map(([category, blocks]) => (
        <Accordion key={category}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {blocks.map((block) => (
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
              >
                {block.label}
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Sidebar;
