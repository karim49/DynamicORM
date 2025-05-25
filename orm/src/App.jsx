import React from 'react';
import Sidebar from './components/Sidebar';
import MainFlow from './components/flow/MainFow';
import { Box } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';

const App = () => (
  <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
    <Sidebar />
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <MainFlow />
    </Box>
  </Box>
);

export default App;
