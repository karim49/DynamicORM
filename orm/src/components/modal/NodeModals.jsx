import React from 'react';
import ConnectionModal from './ConnectionModal';
import FileUploaderModal from './FileUploaderModal';

const NodeModals = ({ open, selectedNode, onClose, setNodes, setEdges }) => {
  if (!selectedNode || !open) return null;

  const { modalType } = selectedNode.data || {};

  if (modalType === 'connection') {
    return (
      <ConnectionModal
        open={open}
        selectedNode={selectedNode}
        onClose={onClose}
        onSubmit={(file, content) => {
          console.log('Received file:', file);
          console.log('Parsed data:', content);
        }}
      />
    );
  }

  if (modalType === 'file') {
    return (
      <FileUploaderModal
        selectedNode={selectedNode}
        open={open}
        onClose={onClose}
        onSubmit={(node, result) => {
          const schemaFields = Object.keys(result.content[0]);
          const childNodeId = `schemaNode-${Date.now()}`;
          const childNode = {
            id: childNodeId,
            type: 'schemaNode',
            position: {
              x: node.position.x + 250,
              y: node.position.y + 100,
            },
            data: {
              label: 'schemaNode',
              schema: schemaFields,
              parentId: node.id,
              sourceName: result.originalName
            },
          };

          const edge = {
            id: `edge-${node.id}-${childNodeId}`,
            source: node.id,
            target: childNodeId,
            type: 'custom',
          };

          setNodes((nds) => [...nds, childNode]);
          setEdges((eds) => [...eds, edge]);
          onClose();
        }}
      />
    );
  }

  return null;
};

export default NodeModals;
