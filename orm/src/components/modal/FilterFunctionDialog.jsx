import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Stack, Chip } from '@mui/material';

const applyFilter = (field, operator, value) => {
  if (!field) return '';
  return `${field} ${operator} ${value}`;
};

const FilterFunctionDialog = ({ open, onClose, onSave, initialField = '', initialOperator = '==', initialValue = '' }) => {
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
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>{`filter(${field}, ${operator}, ${value})`}</Typography>
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
