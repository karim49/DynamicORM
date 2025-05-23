import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import { Box ,Button} from '@mui/material';
import 'reactflow/dist/style.css';

const SelectedSchemaButton = () => {
  const { getNodes } = useReactFlow();
  const handleClick = () => {
    const selectedSchemas = getNodes()
      .filter((node) => node.type === 'schema' && node.data?.isSourceSelected)
      .map((node) => node.data.sourceName);
    console.log('Selected Schemas:', selectedSchemas);
  };

  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      style={{ margin: '5px' }}
      onClick={handleClick}
    >
      Log Schemas
    </Button>
  );
};
const ReactFlowRenderer = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}) => {
  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
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
          <SelectedSchemaButton />
        </Controls>
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default ReactFlowRenderer;
