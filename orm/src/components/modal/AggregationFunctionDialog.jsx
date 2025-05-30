import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Chip, Stack } from '@mui/material';

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

const AggregationFunctionDialog = ({ open, onClose, onSave, initialFields = [], initialOperation = 'sum' }) => {
  const [operation, setOperation] = useState(initialOperation);
  const [result, setResult] = useState('');

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aggregation Function</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 3 }}>
          <Typography variant="subtitle2">Connected Fields</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
            {initialFields.length === 0 ? (
              <Typography color="text.secondary">No fields connected</Typography>
            ) : (
              initialFields.map(f => <Chip key={f} label={f} size="small" />)
            )}
          </Stack>
        </Box>
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
            {`${operation}(${initialFields.join(', ')})`}
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
