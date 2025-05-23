import React from 'react';
import { Box, IconButton,Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';

const CustomNode = ({ id, data }) => {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        border: '1px solid #777',
        borderRadius: 2,
        backgroundColor: 'white',
        minWidth: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        position: 'relative',
        height: '2vh',

      }}
    >

      <Typography sx={{ fontSize: '1.2rem' , fontWeight:'bold'}} color='green'>
        {data.label}
      </Typography>
      {/* <span>{data.label}</span> */}
      <IconButton
        className="delete-icon"
        size="small"
        onClick={handleDelete}
        aria-label="Delete node"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default CustomNode;
