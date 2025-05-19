import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const ConnectionStringDialog = ({ open, onClose, label, connectionString, setConnectionString, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter connection string for {label}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Connection String"
          type="text"
          fullWidth
          variant="standard"
          value={connectionString}
          onChange={(e) => setConnectionString(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionStringDialog;
