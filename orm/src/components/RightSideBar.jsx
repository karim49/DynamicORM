import React from 'react';
import { Button, Fab, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Background } from 'reactflow';
import IntegrateSchemas from './flow/IntegrateSchemas';

const FloatingButton = ({ setAlertMsg, setAlertOpen }) =>
{
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const dispatch = useDispatch();
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



const RightSidebar = ({ setAlertMsg, setAlertOpen }) =>
{
    const nodes = useSelector((state) => state.nodes);

    return (
        <Box sx={{ width: 240, height: '100vh', backgroundColor: '#23272f', color: '#fff', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: 18 }}>
                Operations
            </Typography>
            <Box sx={{ mb: 3 }}>
                <IntegrateSchemas setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />
            </Box>
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
