import React from 'react';
import
  {
    Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails,
  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sourceMeta } from '../lib/sourceMeta';

const Sidebar = () =>
{
  const categorizedDataSources = {};

  Object.entries(sourceMeta).forEach(([key, meta]) =>
  {
    if (!categorizedDataSources[meta.category])
    {
      categorizedDataSources[meta.category] = [];
    }
    categorizedDataSources[meta.category].push({
      type: key, label: meta.label, srcType: meta.srcType
      , category: meta.category
    });
  });

  const handleDragStart = (e, type) =>
  {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(type));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        width: 210,
        height: '100vh',
        bgcolor: '#23272f',
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        boxSizing: 'border-box',
        overflowY: 'auto',
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: 1, mb: 2 }}>
        Data Sources
      </Typography>
      {Object.entries(categorizedDataSources).map(([category, source]) => (
        <Accordion key={category} sx={{ width: '100%', bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />} sx={{ mb: -1.2 }}>
            <Typography variant="subtitle1" sx={{ fontSize: '.8rem', fontWeight: 600, color: '#b0b8c1' }}>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {source.map((src) => (
              <Paper
                key={src.type}
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  cursor: 'grab',
                  userSelect: 'none',
                  fontSize: '.9rem',
                  bgcolor: '#2d323c',
                  color: '#fff',
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: '#3a3f4b' },
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, [src.type,src.srcType])}
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