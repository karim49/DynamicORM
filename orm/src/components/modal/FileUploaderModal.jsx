import React, { useState, useCallback } from 'react';
import
    {
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        Box,
        Typography,
    } from '@mui/material';

const FileUploaderModal = ({ selectedNode, open, onClose, onSubmit }) =>
{
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e) =>
    {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file)
        {
            setSelectedFile(file);
        }
    }, []);

    const handleDragOver = (e) =>
    {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () =>
    {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        // console.log(selectedFile)

        try
        {
            const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/uploadFile`, {

                method: 'POST',
                body: formData,
            });

            if (!response.ok)
            {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            console.log('Upload success:', result);

            if (onSubmit)
            {
                onSubmit(selectedNode, result); // <- sending parsed data
            }
            setSelectedFile(null);
            onClose();
        } catch (error)
        {
            console.error('Upload error:', error);
            // Optionally show error UI here
        }
    };


    const handleClose = () =>
    {
        setSelectedFile(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} sx={{
            '& .MuiDialog-paper': {  // target the dialog paper container
                width: 300,            // fixed width
                height: 200,           // fixed height
                maxWidth: '400px',     // prevent dialog from shrinking/expanding
                maxHeight: '300px',
                overflow: 'hidden',

            },
        }} >
            <DialogTitle>
                <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>
                    Upload File
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    maxWidth="md"
                    sx={{
                        height: 10,
                        justifyContent: 'center',
                        border: '2px dashed gray',
                        borderRadius: 2,
                        padding: 4,
                        textAlign: 'center',
                        backgroundColor: dragOver ? '#f0f0f0' : 'white',
                        cursor: 'pointer',
                        overflow: 'hidden',
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <Typography variant="body1" sx={{ fontSize: selectedFile ? '1rem' : '0.5rem' }}>
                        {selectedFile ? selectedFile.name : 'Drag & Drop a file here or click to select'}
                    </Typography>
                    <input
                        id="file-input"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept="*"

                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button sx={{ fontSize: '.5rem' }} onClick={handleClose}>Cancel</Button>
                <Button sx={{ fontSize: '.5rem' }} variant="contained" onClick={handleSubmit} disabled={!selectedFile}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploaderModal;
