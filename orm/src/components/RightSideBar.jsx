import React from 'react';
import { Button, Fab, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback ,useState} from 'react';
const FloatingButton = () => {
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const dispatch = useDispatch();
    const nodes = useSelector((state) => state.nodes);

    const handleToggleRightSidebar = useCallback(() => {
        if (nodes.length > 0) {
            setShowRightSidebar(!showRightSidebar);
        }
      
    }, [nodes, showRightSidebar]);

    return (
        <>
            {nodes.length > 0 && (
                <Fab
                    sx={{ position: 'fixed', bottom: 20, right: 20 }}
                    onClick={handleToggleRightSidebar}
                >
                    {showRightSidebar ? (
                        <i className="fa fa-times" />
                    ) : (
                        <i className="fa fa-bars" />
                    )}
                </Fab>
            )}
      {(nodes.length > 0 && showRightSidebar) && <RightSidebar />}
        </>
    );
};



const RightSidebar = () => {
    const nodes = useSelector((state) => state.nodes);

    return (
        <Box sx={{ width: 200, height: '100vh', backgroundColor: '#333', color: '#fff', padding: 0 }}>
            <Typography variant="h6"></Typography>
            <div>
                {nodes.map((node) => (
                    <div key={node.id}>{node.name}</div>
                ))}
            </div>
        </Box>
    );
};

export default FloatingButton;
