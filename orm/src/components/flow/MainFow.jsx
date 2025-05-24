import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import FlowRenderer from './FlowRenderer';
import NodeModals from '../modal/NodeModals';
import useFlowHandlers from './flowHandler';
import { Background } from 'reactflow';
const MainFlow = () =>
{
  const [selectedNode, setSelectedNode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onDragOver,
    onConnect,
    handleNodeClick,
    setNodes,
    setEdges,
  } = useFlowHandlers({ setSelectedNode, setOpenModal, });

  const handleCloseModal = useCallback(() =>
  {
    setSelectedNode(null);
    setOpenModal(false);
  }, []);

  return (
    <Box
      style={{ flex: 1, height: '100vh', backgroundColor: 'rgba(225, 250, 227, 0.47)' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <FlowRenderer
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        setNodes={setNodes}
        setEdges={setEdges}
      />
      <NodeModals
        open={openModal}
        selectedNode={selectedNode}
        onClose={handleCloseModal}
        setNodes={setNodes}
        setEdges={setEdges}
      />
    </Box>
  );
};

export default MainFlow;
