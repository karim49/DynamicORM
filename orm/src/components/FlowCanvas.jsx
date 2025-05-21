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
import 'reactflow/dist/style.css';
import { Box } from '@mui/material';

import ConnectionModal from './ConnectionModal';
import FileUploader from './FileUploader';
import { nodeTypes, edgeTypes } from './nodeTypes';
import { sourceMeta } from '../lib/sourceMeta';

const initialNodes = [];
const initialEdges = [];

const FlowCanvas = () =>
{
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const [selectedNode, setSelectedNode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = useCallback((nodeId) =>
  {
    setNodes((nds) =>
    {
      const toDelete = new Set([nodeId]);
      const collectChildren = (id) =>
      {
        nds.forEach((node) =>
        {
          if (node.data?.parentId === id)
          {
            toDelete.add(node.id);
            collectChildren(node.id); // recursive
          }
        });
      };
      collectChildren(nodeId);
      return nds.filter((node) => !toDelete.has(node.id));
    });

    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, [setNodes, setEdges]);
  const onNodesChangeWrapper = useCallback(
    (changes) =>
    {
      // Separate position changes (we want to handle) from others
      const positionChanges = changes.filter(c => c.type === 'position' && c.position);
      const otherChanges = changes.filter(c => c.type !== 'position');

      if (positionChanges.length === 0)
      {
        // No position change, just delegate to default handler
        onNodesChange(changes);
        return;
      }

      // For position changes, handle custom logic:
      setNodes((prevNodes) =>
      {
        let updatedNodes = [...prevNodes];

        positionChanges.forEach((change) =>
        {
          const movedNode = updatedNodes.find((n) => n.id === change.id);
          if (!movedNode) return;

          const dx = change.position.x - movedNode.position.x;
          const dy = change.position.y - movedNode.position.y;

          movedNode.position = change.position;

          // Move children recursively
          const moveChildren = (parentId) =>
          {
            updatedNodes = updatedNodes.map((node) =>
            {
              if (node.data?.parentId === parentId)
              {
                const newPos = {
                  x: node.position.x + dx,
                  y: node.position.y + dy,
                };
                moveChildren(node.id);
                return { ...node, position: newPos };
              }
              return node;
            });
          };
          moveChildren(movedNode.id);
        });

        return updatedNodes;
      });

      // Finally delegate all other changes (like add/remove) to default handler
      if (otherChanges.length > 0)
      {
        onNodesChange(otherChanges);
      }
    },
    [onNodesChange, setNodes]
  );


  const onDrop = useCallback(
    (event) =>
    {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/my-app');
      const meta = sourceMeta[type];
      if (!meta) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode = {
        id: `${+new Date()}`,
        type: 'custom',
        position,
        data: {
          label: `${meta.label} Block`,
          sourceType: type,
          category: meta.category,
          modalType: meta.modalType,
          onDelete: handleDelete,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, handleDelete]
  );

  const onDragOver = useCallback((event) =>
  {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event, node) =>
  {
    if (event.target.closest('.delete-icon')) return;
    if (node.data?.label === 'SchemaBox') return;
    setSelectedNode(node);
    setOpenModal(true);
  }, []);

  const handleCloseModal = () =>
  {
    setSelectedNode(null);
    setOpenModal(false);
  };

  return (
    <Box style={{ flex: 1, height: '100vh' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {selectedNode && openModal && selectedNode.data?.modalType === 'connection' && (
        <ConnectionModal
          open={openModal}
          onClose={handleCloseModal}
          selectedNode={selectedNode}
          onSubmit={(file, content) =>
          {
            console.log('Received file:', file);
            console.log('Parsed data from backend:', content);
          }}
        />
      )}

      {selectedNode && openModal && selectedNode.data?.modalType === 'file' && (
        <FileUploader
          selectedNode={selectedNode}
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={(selectedNode, content) =>
          {
            const schemaFields = Object.keys(content[0]);
            const childNodeId = `schema-${Date.now()}`;

            const childNode = {
              id: childNodeId,
              type: 'schema',
              position: {
                x: selectedNode.position.x + 250,
                y: selectedNode.position.y + 100,
              },
              data: {
                label: 'SchemaBox',
                schema: schemaFields,
                parentId: selectedNode.id,
              },
            };

            const connectingEdge = {
              id: `edge-${selectedNode.id}-${childNodeId}`,
              source: selectedNode.id,
              target: childNodeId,
              type: 'custom',
            };

            setNodes((nds) => [...nds, childNode]);
            setEdges((eds) => [...eds, connectingEdge]);

            handleCloseModal();
          }}
        />
      )}
    </Box>
  );
};

export default FlowCanvas;
