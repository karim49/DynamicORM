import React from 'react';
import { Button, Fab, Box, Typography, Card, CardContent, Modal, Fade, Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Background } from 'reactflow';
import IntegrateSchemas from './flow/IntegrateSchemas';
import { buildPipeline } from '../utils/pipelineBuilder';
import { fetchSampleRecordApi } from './api/nodeHelpers';
        
const FloatingButton = ({ setAlertMsg, setAlertOpen }) =>
{
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const nodes = useSelector((state) => state.nodes);

    const handleToggleRightSidebar = useCallback(() =>
    {
        if (nodes.length > 0)
        {
            setShowRightSidebar(!showRightSidebar);
        }

    }, [nodes, showRightSidebar]);

    return (
        <>
            {nodes.length > 0 && (
                (() => {
                    const fabSx = showRightSidebar
                        ? { position: 'fixed', bottom: 25, right: 30 }
                        : { position: 'fixed', top: 25, right: 30, backgroundColor: '#23272f', color: '#fff' };
                    return (
                        <Fab
                            sx={fabSx}
                            onClick={handleToggleRightSidebar}
                            aria-label={showRightSidebar ? 'Close sidebar' : 'Open sidebar'}
                        >
                            {showRightSidebar ? (
                                <CloseIcon />
                            ) : (
                                <MenuIcon sx={{ color: 'green' }} />
                            )}
                        </Fab>
                    );
                })()
            )}
            {(nodes.length > 0 && showRightSidebar) && <RightSidebar setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />}
        </>
    );
};



const PipelineCard = ({ pipeline, onSubmit }) => (
    <Card sx={{ mb: 2, bgcolor: '#1a1a1a', color: '#fff' }}>
        <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Pipeline Preview</Typography>
            <pre style={{ fontSize: 12, color: '#fff', background: 'none', padding: 0, margin: 0 }}>
                {JSON.stringify(pipeline, null, 2)}
            </pre>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={() => onSubmit(pipeline)}>
                    Submit to Backend
                </Button>
            </Box>
        </CardContent>
    </Card>
);

const PipelineModal = ({ open, pipeline, onClose, onSubmit }) => {
  const [sample, setSample] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleShowSample = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSampleRecordApi(pipeline);
      setSample(result);
    } catch {
      setError('Failed to fetch sample');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setSample(null);
    setError(null);
    setLoading(false);
  }, [open, pipeline]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          bgcolor: '#23272f',
          color: '#fff',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: 'none',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Pipeline Preview</Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#181a20', borderRadius: 1, p: 2, mb: 2 }}>
            <pre style={{ fontSize: 13, color: '#fff', background: 'none', padding: 0, margin: 0 }}>
              {JSON.stringify(pipeline, null, 2)}
            </pre>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
            <Button onClick={onClose} color="inherit" variant="outlined">Close</Button>
            <Button variant="contained" color="primary" onClick={() => onSubmit(pipeline)}>
              Submit to Backend
            </Button>
            <Button variant="outlined" color="info" onClick={handleShowSample} disabled={loading}>
              {loading ? 'Loading...' : 'Show Sample'}
            </Button>
          </Box>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          {sample && (
            <Box sx={{ maxHeight: 160, overflow: 'auto', bgcolor: '#222', borderRadius: 1, p: 2, mt: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#90caf9', mb: 1 }}>Sample Output:</Typography>
              <pre style={{ fontSize: 13, color: '#fff', background: 'none', padding: 0, margin: 0 }}>
                {JSON.stringify(sample, null, 2)}
              </pre>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

const RightSidebar = ({ setAlertMsg, setAlertOpen }) =>
{
    const nodes = useSelector((state) => state.nodes);
    const edges = useSelector((state) => state.edges);
    const [pipeline, setPipeline] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleProcessPipeline = () =>
    {
        const result = buildPipeline(nodes, edges);
        setPipeline(result);
        setShowModal(true);
    };

    const handleSubmit = async (pipeline) =>
    {
        // TODO: Replace with your backend API call
        try
        {
            const res = await fetch('/api/processPipeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pipeline),
            });
            if (!res.ok) throw new Error('Failed to submit pipeline');
            setAlertMsg && setAlertMsg('Pipeline submitted successfully!');
            setAlertOpen && setAlertOpen(true);
            setShowModal(false);
        } catch (e)
        {
            setAlertMsg && setAlertMsg('Pipeline submission failed.');
            setAlertOpen && setAlertOpen(true);
        }
    };

    return (
        <Box sx={{ width: 240, height: '100vh', backgroundColor: '#23272f', color: '#fff', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: 18 }}>
                Operations
            </Typography>
            <Box sx={{ mb: 3 }}>
                <IntegrateSchemas setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />
            </Box>
            <Box sx={{ mb: 3 }}>
                <Button variant="outlined" color="success" fullWidth onClick={handleProcessPipeline}>
                    Process Pipeline
                </Button>
            </Box>
            <PipelineModal open={showModal} pipeline={pipeline} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', fontSize: 15 }}>
                Nodes
            </Typography>
            <div>
                {nodes.map((node) => (
                    <div key={node.id}>{node.data?.label || node.id}</div>
                ))}
            </div>
        </Box>
    );
};

export default FloatingButton;
