import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Chip, Stack } from '@mui/material';
import { useSelector } from 'react-redux';

const applyAggregation = (fields, operation) => {
  if (!fields.length) return '';
  switch (operation) {
    case 'sum':
      return fields.join(' + ');
    case 'avg':
      return `(${fields.join(' + ')}) / ${fields.length}`;
    case 'min':
      return `min(${fields.join(', ')})`;
    case 'max':
      return `max(${fields.join(', ')})`;
    case 'count':
      return `count(${fields.join(', ')})`;
    case 'median':
      return `median(${fields.join(', ')})`;
    case 'stddev':
      return `stddev(${fields.join(', ')})`;
    default:
      return fields.join(', ');
  }
};

const AggregationFunctionDialog = ({ open, onClose, onSave, initialFields = [], initialOperation = 'sum', nodeId }) => {
  const [operation, setOperation] = useState(initialOperation);
  const [result, setResult] = useState('');

  // Connected fields logic
  const edges = useSelector(state => state.edges);
  const nodes = useSelector(state => state.nodes);
  const connectedFields = edges
    .filter(e => e.target === nodeId && nodes.find(n => n.id === e.target)?.data?.label?.toLowerCase() === 'aggregation')
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

  // Always use initialFields as the source of truth for fields
  useEffect(() => {
    setResult(applyAggregation(initialFields, operation));
  }, [initialFields, operation]);

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };

  const handleSave = () => {
    onSave({ fields: initialFields, operation, result });
  };

  // For preview, use all connected field labels if available
  const previewFields = uniqueConnectedFields.length > 0 ? uniqueConnectedFields.map(f => f.label) : initialFields;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aggregation Function</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 3 }}>
          <Typography variant="subtitle2">Connected Fields</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
            {uniqueConnectedFields.length === 0 ? (
              <Typography color="text.secondary">No fields connected</Typography>
            ) : (
              uniqueConnectedFields.map(f => <Chip key={f.fieldId} label={f.label} size="small" color="primary" />)
            )}
          </Stack>
        </Box>
        {/* Optionally, if only one field is connected, show it as a chip in the input */}
        <TextField
          label="Operation"
          value={operation}
          onChange={handleOperationChange}
          select
          SelectProps={{ native: true }}
          fullWidth
          sx={{ mb: 2 }}
        >
          <option value="sum">sum</option>
          <option value="avg">avg</option>
          <option value="min">min</option>
          <option value="max">max</option>
          <option value="count">count</option>
          <option value="median">median</option>
          <option value="stddev">stddev</option>
        </TextField>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', mb: 1 }}>Function Preview</Typography>
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>
            {`${operation}(${previewFields.join(', ')})`}
          </Typography>
          <Typography sx={{ color: '#388e3c', fontFamily: 'monospace', fontWeight: 600 }}>
            {result}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AggregationFunctionDialog;
