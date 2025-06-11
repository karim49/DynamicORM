import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import EtlLoadDialog from '../modal/EtlLoadDialog';
import { updateNode } from '../../store/slices/nodesSlice';

const EtlLoadNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodes = useSelector(state => state.nodes);

  // Fetch edges from Redux state
  const edges = useSelector(state => state.edges);

  // Determine connection state dynamically
  const isInputConnected = edges.some(edge => edge.target === id);

  const handleDialogSave = (params) => {
    setDialogOpen(false);
    
    // Update node data with new parameters
    const sanitizedData = {
      ...data,
      mode: params.mode,
      dir: params.dir,
      fileName: params.fileName,
      connString: params.connString,
      dbName: params.dbName
    };
    // Remove non-serializable data
    delete sanitizedData.onDeleteNode;

    // Dispatch updateNode action to update Redux state
    dispatch(updateNode({
      id,
      data: sanitizedData,
      type: 'etlLoadNode',
      position: nodes.find(n => n.id === id)?.position || { x: 0, y: 0 }
    }));
  };

  const inputHandleStyle = {
    left: '50%',
    top: 0,
    width: 10,
    height: 10,
    background: isInputConnected ? '#43a047' : '#bdbdbd',
    borderRadius: 5,
    border: '2px solid #fff',
  };

  return (
    <>
      <Box
        sx={{
          padding: 2.5,
          border: '1.5px solid #e0e3e7',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #fffbe7 0%, #e3f2fd 60%, #f0f4c3 100%)',
          minWidth: 120,
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          position: 'relative',
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12), 0 0.5px 1.5px 0 #fff inset',
          height: 'auto',
          mb: 1,
          borderTop: '3px solid #ffe082',
          borderLeft: '3px solid #fff',
          borderRight: '3px solid #b0b8c1',
          borderBottom: '3px solid #b0b8c1',
          cursor: 'pointer',
          transition: 'transform 0.18s, box-shadow 0.18s',
          '&:hover': {
            transform: 'scale(1.045) translateY(-2px)',
            boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
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
        <Handle type="target" position="top" id="etl-input" style={inputHandleStyle} />
      </Box>
      <EtlLoadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        loadType={data.label}
      />
    </>
  );
};

export default EtlLoadNode;
