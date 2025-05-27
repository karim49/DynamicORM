import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import FlowRenderer from './FlowRenderer';
import NodeModals from '../modal/NodeModals';
import useFlowHandlers from './flowHandler';
import { Background } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedNode, setOpenModal } from '../../store/slices/uiSlice';

const MainFlow = ({ setAlertMsg, setAlertOpen }) =>
{
  const dispatch = useDispatch();
  const handleCloseModal = useCallback(() =>
  {
    dispatch(setSelectedNode(null));
    dispatch(setOpenModal(true));
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        height: '95vh',
        background: 'linear-gradient(135deg, #e9ecef 0%, #f4f6f8 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: 2,
        p: 2,
      }}>
      <FlowRenderer setAlertMsg={setAlertMsg} setAlertOpen={setAlertOpen} />
      <NodeModals onClose={handleCloseModal} />
    </Box>
  );
};

export default MainFlow;
