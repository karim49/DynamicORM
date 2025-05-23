import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ReactFlowRenderer from './flow/ReactFlowRenderer';
import NodeModals from './modals/NodeModals';
import useFlowHandlers from './hooks/useFlowHandlers';
const FlowCanvas = () => {
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
  } = useFlowHandlers({
    setSelectedNode,
    setOpenModal,
  });

  const handleCloseModal = useCallback(() => {
    setSelectedNode(null);
    setOpenModal(false);
  }, []);

  return (
    <Box
      style={{ flex: 1, height: '100vh' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlowRenderer
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick} 
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

export default FlowCanvas;
