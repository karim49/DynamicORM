import React, { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FileDropArea = ({ open, onClose, nodeLabel, onFileDrop }) => {
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        onFileDrop(event.dataTransfer.files[0]);
        event.dataTransfer.clearData();
      }
    },
    [onFileDrop]
  );

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        border: '2px dashed #ccc',
        borderRadius: 2,
        width: 400,
        height: 200,
        bgcolor: '#fafafa',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Typography variant="h6" gutterBottom>
        Drop a file for {nodeLabel}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Drag & drop your file here, or click to select
      </Typography>
      <Button variant="contained" component="label">
        Select File
        <input
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileDrop(e.target.files[0]);
            }
          }}
        />
      </Button>
      <Button onClick={onClose} sx={{ mt: 2 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default FileDropArea;
