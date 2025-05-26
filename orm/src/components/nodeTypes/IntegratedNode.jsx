import React, { useState } from 'react';
import { Box, IconButton, Typography, Menu, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import { useDispatch } from 'react-redux';
import { removeNode } from '../../store/slices/nodesSlice';

const IntegratedNode = ({ id, data }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const dispatch = useDispatch();
    const handleDelete = (e) => {
        e.stopPropagation();
        dispatch(removeNode(id));
    };
    const handleContextMenu = (event) => {
        event.preventDefault();
        setMenuAnchor(event.currentTarget);
    };
    const handleMenuClose = () => setMenuAnchor(null);
    const handleSubmit = () => {
        // Placeholder for submit logic
        alert('Submit integrated schema!');
        setMenuAnchor(null);
    };
    const handleExportJSON = () => {
        const json = JSON.stringify(data.schema, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.label || 'integrated-schema'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMenuAnchor(null);
    };
    const handleCopySchema = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data.schema, null, 2));
            alert('Schema copied to clipboard!');
        } catch {
            alert('Failed to copy schema.');
        }
        setMenuAnchor(null);
    };
    const handleDeleteMenu = () => {
        dispatch(removeNode(id));
        setMenuAnchor(null);
    };
    return (
        <Box
            sx={{
                padding: 2,
                border: '1px solid #e0e3e7',
                borderRadius: 3,
                backgroundColor: '#fff',
                minWidth: 180,
                maxWidth: 420,
                maxHeight: 320,
                // overflowY: 'auto',
                boxShadow: 2,
                position: 'relative',
                mb: 2,
                userSelect: 'none',
            }}
            onContextMenu={handleContextMenu}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Typography
                    variant="h6"
                    sx={{ fontSize: 17, fontWeight: 700, color: '#388e3c', textAlign: 'center', flex: 1 }}
                >
                    {data.label || 'Integrated Schema'}
                </Typography>
                <IconButton
                    className="delete-icon"
                    size="small"
                    onClick={handleDelete}
                    aria-label="Delete node"
                    sx={{ color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
            {/* Show integrated schema fields in a scrollable area */}
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 1, mb: 1 }}>
                <List dense disablePadding>
                    {(data.schema || []).map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                            <ListItemText
                                primary={typeof item === 'string' ? item : item.field}
                                secondary={item.source ? `Source: ${item.source}` : undefined}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Handle type="target" position="top" />
            {/* <Handle type="source" position="bottom" /> */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <MenuItem onClick={handleSubmit}>Submit</MenuItem>
                <MenuItem onClick={handleExportJSON}>Export as JSON</MenuItem>
                <MenuItem onClick={handleCopySchema}>Copy Schema</MenuItem>
                <MenuItem onClick={handleDeleteMenu} sx={{ color: 'red' }}>Delete</MenuItem>
            </Menu>
        </Box>
    );
};

export default IntegratedNode;
