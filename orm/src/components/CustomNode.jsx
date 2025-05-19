import React from 'react';
import { Handle } from 'reactflow';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Box, Typography } from '@mui/material';

const CustomNode = ({ id, data }) => {
    const { label } = data;

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent modal from opening
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    return (
        <Box
            sx={{
                padding: 1,
                border: '1px solid #777',
                borderRadius: 2,
                backgroundColor: 'white',
                minWidth: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                userSelect: 'none',
            }}
        >
            <Typography variant="body2">{label}</Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </div>

            {/* You can add Handles here if you want connection points */}
            <Handle type="source" position="right" />
            <Handle type="target" position="left" />
        </Box>
    );
};

export default CustomNode;
