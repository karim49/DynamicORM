import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';

import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import 'reactflow/dist/style.css';

import ConnectionModal from './ConnectionModal';
import FileUploader from './FileUploader';

const initialNodes = [];
const initialEdges = [];

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  const [selectedNode, setSelectedNode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/my-app');
      if (!type) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: `${+new Date()}`,
        type: 'default',
        position,
        data: { label: `${type} Block`, blockType: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event, node) => {
    // Prevent modal on trash icon click
    if (event.target.closest('.delete-icon')) return;

    setSelectedNode(node);
    setOpenModal(true);
  }, []);

  const handleCloseModal = () => {
    setSelectedNode(null);
    setOpenModal(false);
  };

  const handleDelete = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleSubmit = (nodeId, payload) => {
    console.log('Submitting:', { nodeId, payload });

    // Submit to backend here
    // fetch('/api/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nodeId, ...payload }),
    // });

    handleCloseModal();
  };

  return (
    <Box style={{ flex: 1, height: '100vh' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <span>{node.data.label}</span>
                <IconButton
                  className="delete-icon"
                  size="small"
                  onClick={() => handleDelete(node.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ),
            blockType: node.data.blockType,
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Show Connection Modal or FileUploader based on type */}
      {selectedNode && openModal && selectedNode.data?.blockType !== 'file' && (
        <ConnectionModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={(value) => handleSubmit(selectedNode.id, { connectionString: value })}
        />
      )}

      {selectedNode && openModal && selectedNode.data?.blockType === 'file' && (
        <FileUploader
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={(file) => handleSubmit(selectedNode.id, { file })}
        />
      )}
    </Box>
  );
};

export default FlowCanvas;
