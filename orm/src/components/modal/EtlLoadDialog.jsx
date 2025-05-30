import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const EtlLoadDialog = ({ open, onClose, onSave, onCheckConnection }) => {
  const [mode, setMode] = useState('file');
  const [dir, setDir] = useState('');
  const [fileName, setFileName] = useState('');
  const [connString, setConnString] = useState('');
  const [dbName, setDbName] = useState('');
  const [connStatus, setConnStatus] = useState(null);

  const handleCheckConnection = async () => {
    if (onCheckConnection) {
      const result = await onCheckConnection(connString, dbName);
      setConnStatus(result ? 'success' : 'fail');
    }
  };

  const handleSave = () => {
    if (mode === 'file') {
      onSave({ mode, dir, fileName });
    } else {
      onSave({ mode, connString, dbName });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save ETL Output</DialogTitle>
      <DialogContent sx={{mb:2,mt:2}} >
        <FormControl fullWidth sx={{ mb: 2 ,mt:2}}>
          <InputLabel>Save Mode</InputLabel>
          <Select value={mode} label="Save Mode" onChange={e => setMode(e.target.value)}>
            <MenuItem value="file">File</MenuItem>
            <MenuItem value="db">Database</MenuItem>
          </Select>
        </FormControl>
        {mode === 'file' ? (
          <>
            <TextField
              label="Directory"
              value={dir}
              onChange={e => setDir(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="e.g. /output/path"
            />
            <TextField
              label="File Name"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="e.g. result.csv"
            />
          </>
        ) : (
          <>
            <TextField
              label="Connection String"
              value={connString}
              onChange={e => setConnString(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="e.g. postgres://user:pass@host:port/db"
            />
            <TextField
              label="Database Name"
              value={dbName}
              onChange={e => setDbName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="e.g. mydatabase"
            />
            <Button onClick={handleCheckConnection} variant="outlined" sx={{ mb: 2 }}>
              Check Connection
            </Button>
            {connStatus === 'success' && <Typography color="green">Connection successful!</Typography>}
            {connStatus === 'fail' && <Typography color="red">Connection failed.</Typography>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EtlLoadDialog;
