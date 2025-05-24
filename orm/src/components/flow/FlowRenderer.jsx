import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import { Box, Button } from '@mui/material';
import 'reactflow/dist/style.css';
import sendSchemaData from '../api/SendSchemaData';

const IntegrateSchemas = ({ nodes, setNodes, setEdges }) => {
  const handleClick = async () => {
    const selectedSchemas = nodes.filter(
      (node) => node.type === 'schemaNode' && node.data?.isSourceSelected
    );
    if (selectedSchemas.length < 2) {
      alert('Please select at least two schemas to integrate.');
      return;
    }
    try {
      const res = await sendSchemaData(selectedSchemas);
      const integratedNode = res.node;
      let parentIds = selectedSchemas.map(node => node.id);
      const ancesstorsIds = selectedSchemas.map(node => node.data.parentId);
      parentIds = [...parentIds, ...ancesstorsIds]
      const integratedNodeWithParents = {
        ...integratedNode, type: 'integratedSchemaNode',

        data: {
          ...integratedNode.data,
          parentIds,
        },
      };
      setNodes(prev => [...prev, integratedNodeWithParents]);
      const newEdges = selectedSchemas.map((node) => ({
        id: `edge-${node.id}-${integratedNode.id}`,
        source: node.id,
        sourceHandle: 'source',
        target: integratedNode.id,
        targetHandle: 'target',
        type: 'custom',
      }));

      setEdges((prev) => [...prev, ...newEdges]);

      console.log('Selected Schemas:', selectedSchemas);
    } catch (error) {
      console.error('Error sending schema data:', error);
    }

  };

  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      style={{ margin: '5px' }}
      onClick={handleClick}
    >
      Integrate Schemas
    </Button>
  );
};
const FlowRenderer = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  setNodes,
  setEdges,
}) => {
  return (
    // <Box sx={{ height: '100vh', width: '100%' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    // fitView
    >

      <MiniMap />
      <Controls>
        <IntegrateSchemas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </Controls>
      <Background color="green" gap={16} />
    </ReactFlow>
    // </Box>
  );
};

export default FlowRenderer;
