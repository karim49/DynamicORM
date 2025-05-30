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
        border: '1px solid #e0e3e7',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minWidth: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        position: 'relative',
        boxShadow: '0 4px 16px 0 rgba(60,72,100,0.18), 0 1.5px 4px 0 rgba(60,72,100,0.12)',
        height: 'auto',
        mb: 1,
        borderTop: '2.5px solid #b2cfff',
        borderLeft: '2.5px solid #fff',
        borderRight: '2.5px solid #b0b8c1',
        borderBottom: '2.5px solid #b0b8c1',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'scale(1.035)',
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.28), 0 3px 8px 0 rgba(60,72,100,0.18)',
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
