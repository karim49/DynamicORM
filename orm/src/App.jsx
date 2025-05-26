import React from 'react';
import Sidebar from './components/Sidebar';
import MainFlow from './components/flow/MainFow';
import { Box } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';

const App = () => (
  <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
    <Sidebar />
    <Box sx={{ flexGrow: 1, position: 'relative', boxShadow: 3, borderRadius: 3, m: 2, bgcolor: '#fff', overflow: 'hidden' }}>
      <MainFlow />
    </Box>
  </Box>
);

export default App;
