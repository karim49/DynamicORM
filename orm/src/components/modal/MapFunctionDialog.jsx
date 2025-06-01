import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

const applyMap = (field, expression) => {
  if (!field || !expression) return '';
  return `${field} => ${expression}`;
};

const MapFunctionDialog = ({ open, onClose, onSave, initialField = '', initialExpression = '', nodeId }) => {
  const [field, setField] = useState(initialField);
  const [expression, setExpression] = useState(initialExpression);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    setPreview(applyMap(field, expression));
  }, [field, expression]);

  const handleSave = () => {
    onSave({ field, expression, preview });
  };

  // Connected field logic (like Replace)
  const edges = useSelector(state => state.edges);
  const nodes = useSelector(state => state.nodes);
  const connectedFields = edges
    .filter(e => e.target === nodeId && nodes.find(n => n.id === e.target)?.data?.label?.toLowerCase() === 'map')
    .map(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      const fieldId = e.sourceHandle;
      let label = fieldId;
      if (sourceNode && sourceNode.data && Array.isArray(sourceNode.data.schema)) {
        const fieldObj = sourceNode.data.schema.find(f => (typeof f === 'object' ? f.field : f) === fieldId);
        if (fieldObj) label = typeof fieldObj === 'object' ? fieldObj.field : fieldObj;
      }
      return { node: sourceNode, fieldId, label };
    });
  // Remove duplicates
  const uniqueConnectedFields = Array.from(new Map(connectedFields.map(f => [f.fieldId, f])).values());
  const connectedFieldLabel = uniqueConnectedFields.length > 0 ? uniqueConnectedFields[0].label : '';

  // For preview, use connected field label if available
  const previewField = connectedFieldLabel || field;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Map Function</DialogTitle>
      <DialogContent>
        <TextField
          label="Field"
          value={field}
          onChange={e => setField(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 3 }}
          InputProps={{
            startAdornment: connectedFieldLabel && (
              <InputAdornment position="start">
                <Chip label={connectedFieldLabel} size="small" color="primary" />
              </InputAdornment>
            )
          }}
          helperText={connectedFieldLabel ? `Connected: ${connectedFieldLabel}` : ''}
        />
        <TextField
          label="Expression"
          value={expression}
          onChange={e => setExpression(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', mb: 1 }}>Function Preview</Typography>
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>{`map(${previewField}, ${expression})`}</Typography>
          <Typography sx={{ color: '#388e3c', fontFamily: 'monospace', fontWeight: 600 }}>{preview}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapFunctionDialog;
