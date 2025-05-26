import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { sendConnectionApi } from '../api/nodeHelpers';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ConnectionModal = ({ open, onClose, selectedNode }) =>
{
    const [connectionString, setConnectionString] = useState('');

    const handleSubmit = async () =>
    {
        try
        {
            await sendConnectionApi({
                nodeId: selectedNode?.id,
                type: selectedNode?.data.sourceType || 'unknown',
                connectionString: connectionString,
            });
            console.log('Connection string sent successfully');
            onClose(); // close modal
        }
        catch (err)
        {
            console.error('Error:', err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Enter Connection String
                </Typography>
                <TextField
                    label="Connection String"
                    fullWidth
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    sx={{ my: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConnectionModal;
