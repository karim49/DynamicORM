import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

const EtlLoadDialog = ({ open, onClose, onSave, onCheckConnection, loadType = 'JSON' }) => {
  const [dir, setDir] = useState('');
  const [fileName, setFileName] = useState('');
  const [connString, setConnString] = useState('');
  const [dbName, setDbName] = useState('');
  const [connStatus, setConnStatus] = useState(null);

  // Set default file extension based on loadType
  useEffect(() => {
    if (loadType && loadType.toLowerCase() === 'json') {
      setFileName(prev => prev || 'output.json');
    } else if (loadType && loadType.toLowerCase() === 'csv') {
      setFileName(prev => prev || 'output.csv');
    }
  }, [loadType]);

  const handleCheckConnection = async () => {
    if (onCheckConnection) {
      const result = await onCheckConnection(connString, dbName);
      setConnStatus(result ? 'success' : 'fail');
    }
  };

  const handleSave = () => {
    const isFileBasedLoad = loadType === 'JSON' || loadType === 'CSV';
    if (isFileBasedLoad) {
      onSave({ mode: 'file', dir, fileName });
    } else {
      onSave({ mode: 'db', connString, dbName });
    }
    onClose();
  };

  const isFileBasedLoad = loadType === 'JSON' || loadType === 'CSV';

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isFileBasedLoad ? `Save as ${loadType} File` : 'Configure Database Connection'}
      </DialogTitle>
      <DialogContent sx={{mb:2,mt:2}} >
        {isFileBasedLoad ? (
          <>
            <TextField
              label="Directory"
              value={dir}
              onChange={e => setDir(e.target.value)}
              fullWidth
              sx={{ mb: 2, mt: 2 }}
              placeholder="e.g. /output/path"
            />
            <TextField
              label="File Name"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder={`e.g. output.${loadType?.toLowerCase()}`}
            />
          </>
        ) : (
          <>
            <TextField
              label="Connection String"
              value={connString}
              onChange={e => setConnString(e.target.value)}
              fullWidth
              sx={{ mb: 2, mt: 2 }}
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
