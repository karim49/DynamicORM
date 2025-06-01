import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

function applyReplaceFunction(input, searchValue, replaceValue) {
  if (typeof input !== 'string') return '';
  try {
    return input.replaceAll(searchValue, replaceValue);
  } catch {
    return '';
  }
}

const ReplaceFunctionDialog = ({ open, onClose, onSave, initialValue = '', initialSearch = '', initialReplace = '', nodeId }) => {
  const [input, setInput] = useState(initialValue);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [replaceValue, setReplaceValue] = useState(initialReplace);
  const [result, setResult] = useState('');

  useEffect(() => {
    setResult(applyReplaceFunction(input, searchValue, replaceValue));
  }, [input, searchValue, replaceValue]);

  useEffect(() => {
    if (open) setInput(initialValue);
  }, [open, initialValue]);

  const handleSave = () => {
    onSave({ input, searchValue, replaceValue, result });
  };

  // Get all fields connected to this replace node only (not all transform functions)
  const edges = useSelector(state => state.edges);
  const nodes = useSelector(state => state.nodes);
  const connectedFields = edges
    .filter(e => e.target === nodeId && nodes.find(n => n.id === e.target)?.data?.label?.toLowerCase() === 'replace')
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
  // Find applied functions for the connected field (if any)
  const appliedFunctions = (uniqueConnectedFields.length > 0 && nodeId && nodes.find(n => n.id === nodeId)?.data?.params)
    ? Object.entries(nodes.find(n => n.id === nodeId).data.params).filter(([k, v]) => v && v !== '').map(([k, v]) => `${k}: ${v}`)
    : [];

  // For preview, use connected field label if available
  const previewField = connectedFieldLabel || input;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Replace Function</DialogTitle>
      <DialogContent >
  
        <TextField
          label="Field"
          value={input}
          onChange={e => setInput(e.target.value)}
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
        {/* Show applied functions as chips below the input */}
        {appliedFunctions.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {appliedFunctions.map((fn, i) => (
              <Chip key={i} label={fn} color="success" size="small" />
            ))}
          </Box>
        )}
        <TextField
          label="Search For"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Replace With"
          value={replaceValue}
          onChange={e => setReplaceValue(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', mb: 1 }}>Result Preview</Typography>
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>
            {`replace(${previewField || 'field'}, ${searchValue || 'search'}, ${replaceValue || 'value'})`}
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

export default ReplaceFunctionDialog;
