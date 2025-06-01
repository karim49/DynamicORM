import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Stack, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';

const applyFilter = (field, operator, value) => {
  if (!field) return '';
  return `${field} ${operator} ${value}`;
};

const FilterFunctionDialog = ({ open, onClose, onSave, initialField = '', initialOperator = '==', initialValue = '', nodeId }) => {
  const [field, setField] = useState(initialField);
  const [operator, setOperator] = useState(initialOperator);
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    setPreview(applyFilter(field, operator, value));
  }, [field, operator, value]);

  const handleSave = () => {
    onSave({ field, operator, value, preview });
  };

  // Connected field logic (like Replace)
  const edges = useSelector(state => state.edges);
  const nodes = useSelector(state => state.nodes);
  const connectedFields = edges
    .filter(e => e.target === nodeId && nodes.find(n => n.id === e.target)?.data?.label?.toLowerCase() === 'filter')
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
      <DialogTitle>Filter Function</DialogTitle>
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
          label="Operator"
          value={operator}
          onChange={e => setOperator(e.target.value)}
          select
          SelectProps={{ native: true }}
          fullWidth
          sx={{ mb: 2 }}
        >
          <option value="==">==</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value=">=">&gt;=</option>
          <option value="<=">&lt;=</option>
          <option value="!=">!=</option>
          <option value="contains">contains</option>
        </TextField>
        <TextField
          label="Value"
          value={value}
          onChange={e => setValue(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', mb: 1 }}>Function Preview</Typography>
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>{`filter(${previewField}, ${operator}, ${value})`}</Typography>
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

export default FilterFunctionDialog;
