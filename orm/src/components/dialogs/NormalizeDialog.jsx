import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setNodes } from '../../store/slices/nodesSlice';

const NormalizeDialog = ({ open, onClose, nodeId }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  const [fieldMappings, setFieldMappings] = useState({});

  // Find the normalize node and its connected fields
  useEffect(() => {
    if (!open || !nodeId) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Get incoming edges to this node
    const incomingEdges = edges.filter(e => e.target === nodeId);
    
    // Create initial field mappings
    const initialMappings = {};
    incomingEdges.forEach(edge => {
      initialMappings[edge.sourceHandle] = node.data?.fieldMappings?.[edge.sourceHandle] || edge.sourceHandle;
    });

    setFieldMappings(initialMappings);
  }, [open, nodeId, nodes, edges]);

  const handleSave = () => {
    // Update the node data with new field mappings
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            fieldMappings: { ...fieldMappings }
          }
        };
      }
      return node;
    });

    dispatch(setNodes(updatedNodes));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#23272f',
          color: '#fff',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        Normalize Field Names
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#b0b8c1' }}>
          Specify new names for the connected fields. These names will be used in the output.
        </Typography>
        {Object.entries(fieldMappings).map(([originalField, newField]) => (
          <Box key={originalField} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={`Rename ${originalField}`}
              value={newField}
              onChange={(e) => setFieldMappings(prev => ({
                ...prev,
                [originalField]: e.target.value
              }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b8c1',
                },
              }}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NormalizeDialog; 