import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';

const DataSourceNode = ({ id, data }) =>
{
  return (
    <Box
      sx={{
        padding: 2,
        border: '1.5px solid #e0e3e7',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #e3f0ff 0%, #c3cfe2 60%, #f5f7fa 100%)',
        minWidth: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        position: 'relative',
        boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12), 0 0.5px 1.5px 0 #fff inset',
        height: 'auto',
        mb: 1,
        borderTop: '3px solid #b2cfff',
        borderLeft: '3px solid #fff',
        borderRight: '3px solid #b0b8c1',
        borderBottom: '3px solid #b0b8c1',
        transition: 'transform 0.18s, box-shadow 0.18s',
        '&:hover': {
          transform: 'scale(1.045) translateY(-2px)',
          boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
        },
      }}
    >
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d323c' }}>
        {data.label}
      </Typography>
      <IconButton
        className="delete-icon"
        size="small"
        onClick={e => {
          e.stopPropagation();
          data.onDeleteNode?.(id);
        }}
        aria-label="Delete node"
        sx={{ ml:'1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default DataSourceNode;
