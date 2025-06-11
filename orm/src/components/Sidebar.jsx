import React, { useState, useEffect } from 'react';
import
  {
    Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Button, Divider,
  } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FunctionsIcon from '@mui/icons-material/Functions';
import TransformIcon from '@mui/icons-material/Transform';
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';  
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import MergeIcon from '@mui/icons-material/Merge';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import JoinFullIcon from '@mui/icons-material/JoinFull';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
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
  const [expanded, setExpanded] = useState(null);
  const [etlExpanded, setEtlExpanded] = useState(null);

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

  // Helper for main accordions
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  // Track which sub-accordion is expanded for each section (optional, for nested accordions)
  const handleEtlAccordionChange = (panel) => (event, isExpanded) => {
    setEtlExpanded(isExpanded ? panel : null);
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
      <Accordion expanded={expanded === 'dataSources'} onChange={handleAccordionChange('dataSources')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
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
      <Accordion expanded={expanded === 'schemas'} onChange={handleAccordionChange('schemas')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
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
      <Accordion expanded={expanded === 'operations'} onChange={handleAccordionChange('operations')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
          <CompareArrowsIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography sx={{ fontSize: '.95rem', fontWeight: 600, color: '#b0b8c1' }}>Operations</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {[
            { label: 'Inner Join', icon: <JoinInnerIcon />, type: 'inner' },
            { label: 'Left Join', icon: <JoinFullIcon />, type: 'left' },
            { label: 'Right Join', icon: <JoinFullIcon sx={{ transform: 'scaleX(-1)' }} />, type: 'right' },
            { label: 'Full Join', icon: <MergeIcon />, type: 'full' },
            { label: 'Union', icon: <CompareArrowsIcon />, type: 'union' },
            { label: 'Normalize', icon: <TransformIcon />, type: 'normalize' }
          ].map((op) => (
            <Paper
              key={op.label}
              elevation={0}
              sx={{
                p: 1.2,
                mb: 1,
                cursor: 'grab',
                userSelect: 'none',
                fontSize: '.9rem',
                bgcolor: '#2d323c',
                color: '#fff',
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'background 0.2s',
                '&:hover': { bgcolor: '#3a3f4b' },
              }}
              draggable
              onDragStart={e => e.dataTransfer.setData('application/operation', JSON.stringify({ type: 'operation', operationType: op.type }))}
              title={`Drag to canvas: ${op.label}`}
            >
              {op.icon}
              {op.label}
            </Paper>
          ))}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'etl'} onChange={handleAccordionChange('etl')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            ETL
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {/* Transform Subsection */}
          <Accordion expanded={etlExpanded === 'transform'} onChange={handleEtlAccordionChange('transform')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <TransformIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: '.95rem', fontWeight: 600, color: '#b0b8c1' }}>Transform</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {[{label: 'Aggregation', icon: <FunctionsIcon />}, {label: 'Replace', icon: <SyncAltIcon />}, {label: 'Filter', icon: <TableChartIcon />}, {label: 'Map', icon: <TransformIcon />}].map((etl, idx) => (
                <Paper
                  key={etl.label}
                  elevation={0}
                  sx={{
                    p: 1.2,
                    mb: 1,
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '.9rem',
                    bgcolor: '#2d323c',
                    color: '#fff',
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: '#3a3f4b' },
                  }}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('application/etl-fn', etl.label)}
                  title={`Drag to canvas: ${etl.label}`}
                >
                  {etl.icon}
                  {etl.label}
                </Paper>
              ))}
            </AccordionDetails>
          </Accordion>
          {/* Load Subsection */}
          <Accordion expanded={etlExpanded === 'load'} onChange={handleEtlAccordionChange('load')} sx={{ bgcolor: '#23272f', color: '#fff', boxShadow: 0, border: 0, mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <CloudUploadIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: '.95rem', fontWeight: 600, color: '#b0b8c1' }}>Load</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {[{label: 'JSON', icon: <TableChartIcon />}, {label: 'CSV', icon: <TableChartIcon />}, {label: 'Database', icon: <StorageIcon />}].map((load, idx) => (
                <Paper
                  key={load.label}
                  elevation={0}
                  sx={{
                    p: 1.2,
                    mb: 1,
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '.9rem',
                    bgcolor: '#2d323c',
                    color: '#fff',
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: '#3a3f4b' },
                  }}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('application/etl-load', load.label)}
                  title={`Drag to canvas: ${load.label}`}
                >
                  {load.icon}
                  {load.label}
                </Paper>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Sidebar;