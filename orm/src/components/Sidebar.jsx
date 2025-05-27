import React, { useState, useEffect } from 'react';
import
  {
    Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Button, Divider,
  } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { sourceMeta } from '../lib/sourceMeta';

// Placeholder: fetch saved schemas from backend
async function fetchSavedSchemas() {
  // Replace with your real API endpoint
  const res = await fetch('/api/savedSchemas');
  if (!res.ok) throw new Error('Failed to fetch saved schemas');
  return res.json();
}

const Sidebar = () =>
{
  const [schemas, setSchemas] = useState([]);
  const [savedSchemas, setSavedSchemas] = useState([]);
  useEffect(() => {
    fetchSavedSchemas()
      .then(data => setSavedSchemas(data))
      .catch(() => setSavedSchemas([]));
  }, []);
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

  const handleLoadSchemaFromJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setSchemas(prev => [...prev, json]);
      alert('Loaded schema: ' + (json.name || file.name));
    } catch (e) {
      alert('Failed to load schema: ' + e.message);
    }
  };

  return (
    <Box
      sx={{
        width: 220,
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
      <Accordion defaultExpanded={false} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            Data Sources
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
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
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            Schemas
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Button
            startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
            size="small"
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#555',
              mb: 1,
              textTransform: 'none',
              fontSize: 11,
              minHeight: 40,
              px: 1.2,
              py: 0.2,
              '&:hover': { borderColor: '#888', bgcolor: '#23272f' },
            }}
            component="label"
          >
            Load Schema from JSON
            <input type="file" accept="application/json" hidden onChange={handleLoadSchemaFromJSON} />
          </Button>
          {/* Saved Schemas from DB - now expandable */}
          <Accordion defaultExpanded={false} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0, mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5, fontWeight: 600 }}>Saved Schemas</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {savedSchemas.length === 0 && <Typography variant="caption" sx={{ color: '#888' }}>No saved schemas found.</Typography>}
              {savedSchemas.map((schema, idx) => (
                <Box key={idx} sx={{ fontSize: 13, color: '#fff', mb: 0.5, pl: 1 }}>
                  {schema.name || `Schema ${idx + 1}`}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
          {/* Example: List loaded schemas */}
          {schemas.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 0.5 }}>Loaded Schemas:</Typography>
              {schemas.map((schema, idx) => (
                <Box
                  key={idx}
                  sx={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#90caf9', mb: 0.5, pl: 1 }}
                >
                  <Box
                    sx={{ cursor: 'pointer', textDecoration: 'underline', flex: 1 }}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('openLoadedSchema', { detail: { schema, idx } }));
                    }}
                  >
                    {schema.name || `Schema ${idx + 1}`}
                  </Box>
                  <CloseIcon
                    fontSize="small"
                    sx={{ ml: 1, cursor: 'pointer', color: '#f44336', '&:hover': { color: '#b71c1c' } }}
                    onClick={() => {
                      setSchemas(prev => prev.filter((_, i) => i !== idx));
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Sidebar;