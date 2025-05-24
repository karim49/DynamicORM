import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import { Box, Button } from '@mui/material';
import 'reactflow/dist/style.css';
import sendSchemaData from '../api/SendSchemaData';
const SelectedSchemaButton = ({ setNodes, setEdges }) =>
{

  const { getNodes, getEdges } = useReactFlow();
  const handleClick = async () =>
  {
    const selectedSchemas = getNodes()
      .filter((node) => node.type === 'schema' && node.data?.isSourceSelected);

    // const selectedSchemas = getNodes()
    //   .filter((node) => node.type === 'schema' && node.data?.isSourceSelected)
    //   .map((node) => node.data.sourceName);

    try
    {
      const res = await sendSchemaData(selectedSchemas);
      const integratedNode = res.node;
      setNodes((prev) => [...prev, integratedNode]);
      const newEdges = selectedSchemas.map((node) => ({
        id: `edge-${node.id}-${integratedNode.id}`,
        source: node.id,
        sourceHandle: node.id,
        target: integratedNode.id,
        targetHandle: 'target',
        type: 'custom',
      }));
      console.log('Selected newEdges:', newEdges);
      console.log('getEdges1:', getEdges());

      setEdges((prev) => [...prev, ...newEdges]);
      console.log('getEdges2:', getEdges());

      console.log('Selected Schemas:', selectedSchemas);
    } catch (error)
    {
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
}) =>
{
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
        <SelectedSchemaButton setNodes={setNodes} setEdges={setEdges} />
      </Controls>
      <Background color="green" gap={16} />
    </ReactFlow>
    // </Box>
  );
};

export default FlowRenderer;
