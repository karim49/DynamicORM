import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainFlow from './components/flow/MainFow';
import { Box } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';
import FloatingButton from './components/RightSideBar';
import AlertModal from './components/modal/AlertModal';

const App = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f4f6f8' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, position: 'relative', boxShadow: 3, borderRadius: 3, m: 2, bgcolor: '#fff', overflow: 'hidden' }}>
        <MainFlow setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />
      </Box>
      <FloatingButton setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />
      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMsg} />
    </Box>
  );
};

export default App;
