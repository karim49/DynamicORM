import React from 'react';
import {
  Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sourceMeta } from '../lib/sourceMeta';

const Sidebar = () => {
  const categorizedDataSources = {};

  Object.entries(sourceMeta).forEach(([key, meta]) => {
    if (!categorizedDataSources[meta.category]) {
      categorizedDataSources[meta.category] = [];
    }
    categorizedDataSources[meta.category].push({ type: key, label: meta.label });
  });

  // FIX: Use 'application/reactflow' so FlowRenderer can read the type
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('application/reactflow', type);
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

      {Object.entries(categorizedDataSources).map(([category, source]) => (
        <Accordion key={category} sx={{ width: 150 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ mb: -1.2 }}>
            <Typography variant="subtitle1" sx={{ fontSize: '.6rem' }}>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {source.map((src) => (
              <Paper
                key={src.type}
                elevation={2}
                sx={{ p: 1.5, mb: 1.5, cursor: 'grab', userSelect: 'none', fontSize: '.6rem' }}
                draggable
                onDragStart={(e) => handleDragStart(e, src.type)}
                title={`Drag to canvas: ${src.label}`}
              >
                {src.label}
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Sidebar;