import React, { useCallback } from 'react';
import { Dialog,  DialogTitle, DialogContent,  DialogActions,Button, Box, Typography,} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addFile } from '../../store/slices/filesSlice';
import { uploadFileApi } from '../api/nodeHelpers';
import AlertModal from './AlertModal';
            
const FileUploaderModal = ({ selectedNode, open, onClose, onSubmit }) =>
{
    const dispatch = useDispatch();
    const files = useSelector(state => state.files);
    const [dragOver, setDragOver] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState('');

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

    const handleSubmit =  useCallback(async () => {
        if (!selectedFile) return;
        // Prevent duplicate upload by file name
        if (files.some(f => f.originalName === selectedFile.name)) {
            setAlertMsg('This file has already been uploaded.');
            setAlertOpen(true);
            setSelectedFile(null);
            // Do NOT call onClose() here!
            return;
        }
        try {
            const result = await uploadFileApi(selectedFile);
            console.log('Upload success:', result);
            // Add file to Redux
            dispatch(addFile(result));
            if (onSubmit) {
                onSubmit(selectedNode, result);
            }
            setSelectedFile(null);
            onClose();
        } catch (error) {
            setAlertMsg('Upload error: ' + error.message);
            setAlertOpen(true);
            console.error('Upload error:', error);
        }
    }, [selectedFile, onSubmit, selectedNode, files, dispatch, onClose]);

    const handleClose = () =>
    {
        setSelectedFile(null);
        onClose();
    };

    return (
        <>
        <Dialog open={open} onClose={handleClose} sx={{
            '& .MuiDialog-paper': {  // target the dialog paper container
                width: 400,            
                height: 200,           
                maxWidth: '400px',     
                maxHeight: '300px',
                overflow: 'hidden',

            },
        }} >
            <DialogTitle>
                <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>
                    Upload File
                </Typography>
            </DialogTitle>
            <DialogContent sx={{
                overflowY: 'hidden',
                maxHeight: 180,
                p: 0
            }}>
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    maxWidth="md"
                    sx={{
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #b0b8c1',
                        borderRadius: 2,
                        padding: 2,
                        textAlign: 'center',
                        backgroundColor: dragOver ? '#f5f7fa' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'background 0.2s, border 0.2s',
                        boxShadow: dragOver ? 2 : 0,
                        minWidth: 220,
                        maxWidth: 340,
                        margin: '0 auto',
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <Typography variant="body1" sx={{ fontSize: selectedFile ? '1rem' : '0.9rem', width: '100%', textAlign: 'center', color: '#23272f' }}>
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
        <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMsg} />
        </>
    );
};

export default FileUploaderModal;
