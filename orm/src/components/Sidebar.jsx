import React from 'react';
import {
  Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
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
        width: 170,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 1,
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }} color='green'>
        Data Sources
      </Typography>

      {Object.entries(categorizedBlocks).map(([category, blocks]) => (
        <Accordion key={category} sx={{ width: 150 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}  sx={{ mb: -1.2 }}>
            <Typography variant="subtitle1" sx={{ fontSize: '.6rem' }}>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails >

              {blocks.map((block) => (

                <Paper
                  key={block.id}
                  elevation={2}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '.6rem',
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
