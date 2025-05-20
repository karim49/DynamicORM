import React from 'react';
import { Box, IconButton } from '@mui/material';
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
                padding: 1,
                border: '1px solid #777',
                borderRadius: 2,
                backgroundColor: 'white',
                minWidth: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
            }}
        >
            <span>{data.label}</span>
            <IconButton className="delete-icon" size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            <Handle type="target" position="left" />
            <Handle type="source" position="right" />
        </Box>
    );
};

export default CustomNode;
