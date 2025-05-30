import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import { useSelector } from 'react-redux';
import EtlLoadDialog from '../modal/EtlLoadDialog';

const EtlLoadNode = ({ id, data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch edges from Redux state
  const edges = useSelector(state => state.edges);

  // Determine connection state dynamically
  const isInputConnected = edges.some(edge => edge.target === id);
  const isOutputConnected = edges.some(edge => edge.source === id);

  const handleDialogSave = () => {
    setDialogOpen(false);
  };

  const inputHandleStyle = {
    left: 0,
    top: '50%',
    width: 10,
    height: 10,
    background: isInputConnected ? '#43a047' : '#bdbdbd',
    borderRadius: 5,
    border: '2px solid #fff',
  };

  const outputHandleStyle = {
    bottom: 0,
    width: 10,
    height: 10,
    background: isOutputConnected ? '#43a047' : '#bdbdbd',
    borderRadius: 5,
    border: '2px solid #fff',
  };

  return (
    <>
      <Box
        sx={{
          padding: 2,
          border: '1px solid #e0e3e7',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fffbe7 0%, #e3f2fd 100%)',
          minWidth: 120,
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          position: 'relative',
          boxShadow: '0 4px 16px 0 rgba(60,72,100,0.18), 0 1.5px 4px 0 rgba(60,72,100,0.12)',
          height: 'auto',
          mb: 1,
          borderTop: '2.5px solid #ffe082',
          borderLeft: '2.5px solid #fff',
          borderRight: '2.5px solid #b0b8c1',
          borderBottom: '2.5px solid #b0b8c1',
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
          '&:hover': {
            transform: 'scale(1.035)',
            boxShadow: '0 8px 32px 0 rgba(60,72,100,0.28), 0 3px 8px 0 rgba(60,72,100,0.18)',
          },
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgb(45, 107, 251)', flex: 1 }}>
          {data.label}
        </Typography>
        <IconButton
          className="delete-icon"
          size="small"
          onClick={e => { e.stopPropagation(); data.onDeleteNode?.(id); }}
          aria-label="Delete node"
          sx={{ ml: '1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        {/* Render a single target handle on the left side */}
        <Handle type="target" position="left" id="etl-input" style={inputHandleStyle} />
        {/* <Handle type="target" position="top" /> */}
        {/* <Handle type="source" position="bottom" style={outputHandleStyle} /> */}
      </Box>
      <EtlLoadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
      />
    </>
  );
};

export default EtlLoadNode;
