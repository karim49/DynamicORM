import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle, useReactFlow } from 'reactflow';

import { useDispatch, useSelector } from 'react-redux';
import { setNodes } from '../../store/slices/nodesSlice';
import { setEdges } from '../../store/slices/edgesSlice';
import { setFiles } from '../../store/slices/filesSlice';

const DataSourceNode = ({ id, data }) =>
{
  const { deleteElements } = useReactFlow();
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  const files = useSelector(state => state.files);

  const handleDelete = () =>
  {
    // Collect all descendants recursively
    const toDelete = new Set();
    const fileNamesToRemove = new Set();
    const collectDescendants = (nodeId) =>
    {
      toDelete.add(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (node && node.type === 'schemaNode' && node.data?.sourceName) {
        fileNamesToRemove.add(node.data.sourceName);
      }
      edges.forEach(edge =>
      {
        if (edge.source === nodeId && !toDelete.has(edge.target))
        {
          collectDescendants(edge.target);
        }
      });
    };
    collectDescendants(id);
    // Remove nodes
    const remainingNodes = nodes.filter(node => !toDelete.has(node.id));
    // Remove files from Redux
    const remainingFiles = files.filter(f => !fileNamesToRemove.has(f.originalName));
    dispatch(setFiles(remainingFiles));
    // After deletion, reposition remaining siblings symmetrically
    const parentId = data.parentId || null;
    if (parentId) {
      const siblings = remainingNodes.filter(n => n.data?.parentId === parentId && n.type === 'schemaNode');
      const siblingCount = siblings.length;
      const spacing = 400;
      const baseX = nodes.find(n => n.id === parentId)?.position.x - ((siblingCount - 1) * spacing) / 2;
      siblings.forEach((sibling, idx) => {
        sibling.position.x = baseX + idx * spacing;
      });
    }
    dispatch(setNodes([...remainingNodes]));
    // Remove edges connected to deleted nodes
    const remainingEdges = edges.filter(
      edge => !toDelete.has(edge.source) && !toDelete.has(edge.target)
    );
    dispatch(setEdges(remainingEdges));
  };

  return (
    <Box
      sx={{
        padding: 2,
        border: '1px solid #e0e3e7',
        borderRadius: 3,
        backgroundColor: '#fff',
        minWidth: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        position: 'relative',
        boxShadow: 2,
        height: 'auto',
        mb: 1,
      }}
    >
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d323c' }}>
        {data.label}
      </Typography>
      <IconButton
        className="delete-icon"
        size="small"
        onClick={e => {
          e.stopPropagation();
          handleDelete();
        }}
        aria-label="Delete node"
        sx={{ ml:'1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default DataSourceNode;
