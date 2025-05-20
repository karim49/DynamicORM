import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
} from '@mui/material';

const FileUploader = ({ open, onClose, onSubmit }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log(selectedFile)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/upload-file', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            console.log('Upload success:', result);

            onSubmit(selectedFile); // Optionally notify parent
            setSelectedFile(null);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            // Optionally show error UI here
        }
    };


    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        border: '2px dashed gray',
                        borderRadius: 2,
                        padding: 4,
                        textAlign: 'center',
                        backgroundColor: dragOver ? '#f0f0f0' : 'white',
                        cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <Typography variant="body1">
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!selectedFile}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploader;
