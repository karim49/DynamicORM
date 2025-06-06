import React, { useState } from 'react';
import { Box, IconButton, Typography, Menu, MenuItem, List, ListItem, ListItemText, Checkbox, Button, ListSubheader, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Handle } from 'reactflow';
import { useDispatch } from 'react-redux';
import { removeNode } from '../../store/slices/nodesSlice';
import { sendSchemaDataApi } from '../api/nodeHelpers';
        
const IntegratedNode = ({ id, data, onDeleteNode }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [saveMenuAnchor, setSaveMenuAnchor] = useState(null);
    const [checked, setChecked] = useState([]);
    const dispatch = useDispatch();
    const schemaItems = data.schema || [];
    const allChecked = checked.length === schemaItems.length && schemaItems.length > 0;

    const handleContextMenu = (event) => {
        event.preventDefault();
        setMenuAnchor(event.currentTarget);
    };
    const handleMenuClose = () => setMenuAnchor(null);
    const handleToggle = (idx) => {
        setChecked((prev) =>
            prev.includes(idx)
                ? prev.filter((i) => i !== idx)
                : [...prev, idx]
        );
    };
    const handleToggleAll = () => {
        if (allChecked) setChecked([]);
        else setChecked(schemaItems.map((_, idx) => idx));
    };
    const handleSubmit = async () => {
        // Send only selected items with their info
        const selectedItems = checked.map(idx => schemaItems[idx]);
        try {
            // Replace with your backend endpoint and payload as needed
            await sendSchemaDataApi(selectedItems);
            alert('Submitted selected items!');
        } catch {
            alert('Failed to submit selected items.');
        }
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
    const handleSaveMenuOpen = (event) => {
        setSaveMenuAnchor(event.currentTarget);
    };
    const handleSaveMenuClose = () => {
        setSaveMenuAnchor(null);
    };
    const handleSaveAsJSON = () => {
        const selectedItems = checked.map(idx => schemaItems[idx]);
        const json = JSON.stringify(selectedItems, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.label || 'integrated-schema'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSaveMenuAnchor(null);
        setMenuAnchor(null);
    };
    const handleSaveInDB = async () => {
        const selectedItems = checked.map(idx => schemaItems[idx]);
        try {
            await sendSchemaDataApi(selectedItems);
            alert('Saved in DB!');
        } catch {
            alert('Failed to save in DB.');
        }
        setSaveMenuAnchor(null);
        setMenuAnchor(null);
    };
    return (
        <Box
            sx={{
                padding: 2.5,
                border: '1.5px solid #e0e3e7',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 60%, #e3f0ff 100%)',
                minWidth: 180,
                maxWidth: 420,
                maxHeight: 320,
                boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12), 0 0.5px 1.5px 0 #fff inset',
                position: 'relative',
                mb: 2,
                userSelect: 'none',
                borderTop: '3px solid #a5d6a7',
                borderLeft: '3px solid #fff',
                borderRight: '3px solid #b0b8c1',
                borderBottom: '3px solid #b0b8c1',
                transition: 'transform 0.18s, box-shadow 0.18s',
                '&:hover': {
                  transform: 'scale(1.045) translateY(-2px)',
                  boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
                },
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
                    onClick={e => { e.stopPropagation(); data.onDeleteNode?.(id); }}
                    aria-label="Delete node"
                    sx={{ color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
            {/* Show integrated schema fields in a scrollable area */}
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 1, mb: 1 }}>
                <List dense disablePadding>
                    <ListItem sx={{ ml:-2,py: 0.1 }} key="main-checkbox">
                        <Checkbox
                            checked={allChecked}
                            indeterminate={checked.length > 0 && !allChecked}
                            onChange={handleToggleAll}
                            size="small"
                        />
                        <ListItemText primary={<b>Select All</b>} />
                    </ListItem>
                    {schemaItems.map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                            <Checkbox
                                checked={checked.includes(idx)}
                                onChange={() => handleToggle(idx)}
                                size="small"
                            />
                            <ListItemText
                                primary={typeof item === 'string' ? item : item.field}
                                secondary={item.source ? `Source: ${item.source}` : undefined}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Handle type="target" position="top" id="target" />
            {/* <Handle type="source" position="bottom" /> */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <MenuItem onClick={handleSubmit}>Submit</MenuItem>
                <MenuItem onClick={handleSaveMenuOpen}>
                    Save Schema
                    <ListItemIcon sx={{ minWidth: 32, ml: 1 }}>
                        <ChevronRightIcon fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={handleExportJSON}>Export as JSON</MenuItem>
                <MenuItem onClick={handleCopySchema}>Copy Schema</MenuItem>
                <MenuItem onClick={handleDeleteMenu} sx={{ color: 'red' }}>Delete</MenuItem>
            </Menu>
            <Menu
                anchorEl={saveMenuAnchor}
                open={Boolean(saveMenuAnchor)}
                onClose={handleSaveMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleSaveAsJSON}>Save as JSON</MenuItem>
                <MenuItem onClick={handleSaveInDB}>Save in DB</MenuItem>
            </Menu>
        </Box>
    );
};

export default IntegratedNode;
