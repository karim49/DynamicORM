import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import { useDispatch } from 'react-redux';
import { setNodes } from '../../store/slices/nodesSlice';
import { useSelector } from 'react-redux';

const EtlTransformNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  // Check if this node's left handle is connected
  const isConnected = edges.some(e => e.target === id && (e.targetHandle === 'etl-input' || !e.targetHandle));
  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(setNodes(nodes.filter(n => n.id !== id)));
  };
  // Find all incoming edges to this node
  const incoming = edges.filter(e => e.target === id);
  // Check if this node has any incoming edges
  const hasIncomingEdges = edges.some(e => e.target === id);
  return (
    <Box
      sx={{
        padding: 2,
        border: '1px solid #e0e3e7',
        borderRadius: 3,
        backgroundColor: hasIncomingEdges ? '#b9f6ca' : '#e3f2fd',
        minWidth: 120,
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        position: 'relative',
        boxShadow: 2,
        height: 'auto',
        mb: 1,
      }}
    >
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1976d2', flex: 1 }}>
        {data.label}
      </Typography>
      <IconButton
        className="delete-icon"
        size="small"
        onClick={handleDelete}
        aria-label="Delete node"
        sx={{ ml: '1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Handle type="target" position="left" id="etl-input" style={{ left: 0, top: '50%', width: 10, height: 10, background: isConnected ? '#43a047' : '#1976d2', borderRadius: 5, border: '2px solid #fff' }} />
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default EtlTransformNode;
