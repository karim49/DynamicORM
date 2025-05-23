import React from 'react';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import { Box } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';

const App = () => {
  return (
    <ReactFlowProvider>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar />
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <FlowCanvas />
        </Box>
      </Box>
    </ReactFlowProvider>
  );
};

export default App;
