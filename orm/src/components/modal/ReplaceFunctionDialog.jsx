import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';

function applyReplaceFunction(input, searchValue, replaceValue) {
  if (typeof input !== 'string') return '';
  try {
    return input.replaceAll(searchValue, replaceValue);
  } catch {
    return '';
  }
}

const ReplaceFunctionDialog = ({ open, onClose, onSave, initialValue = '', initialSearch = '', initialReplace = '' }) => {
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Replace Function</DialogTitle>
      <DialogContent >
        <TextField
          label="Field"
          value={input}
          onChange={e => setInput(e.target.value)}
          fullWidth
          sx={{ mb: 2 ,mt:3}}
        />
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
            {`replace(${input || 'field'}, ${searchValue || 'search'}, ${replaceValue || 'value'})`}
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
