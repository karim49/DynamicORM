import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField } from '@mui/material';

const applyMap = (field, expression) => {
  if (!field || !expression) return '';
  return `${field} => ${expression}`;
};

const MapFunctionDialog = ({ open, onClose, onSave, initialField = '', initialExpression = '' }) => {
  const [field, setField] = useState(initialField);
  const [expression, setExpression] = useState(initialExpression);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    setPreview(applyMap(field, expression));
  }, [field, expression]);

  const handleSave = () => {
    onSave({ field, expression, preview });
  };

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
          <Typography sx={{ color: '#333', fontFamily: 'monospace', mb: 1 }}>{`map(${field}, ${expression})`}</Typography>
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
