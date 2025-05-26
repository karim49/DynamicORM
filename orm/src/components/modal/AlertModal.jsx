import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const AlertModal = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
