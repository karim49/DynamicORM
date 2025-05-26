import React from 'react';
import ConnectionModal from './ConnectionModal';
import FileUploaderModal from './FileUploaderModal';
import AlertModal from './AlertModal';
import { useDispatch, useSelector } from 'react-redux';
import { addNode } from '../../store/slices/nodesSlice';
import { addEdge } from '../../store/slices/edgesSlice';
import { addFile } from '../../store/slices/filesSlice';

const NodeModals = ({ onClose }) =>
{
  const dispatch = useDispatch();
  const selectedNode = useSelector(state => state.ui.selectedNode);
  const openModal = useSelector(state => state.ui.openModal);
  const nodes = useSelector(state => state.nodes);
  const files = useSelector(state => state.files); 
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState('');

  if (!selectedNode || !open) {
    return <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMsg} />;
  }

  const { srcType } = selectedNode.data || {};

  if (srcType === 'connection')
  {
    return (
      <ConnectionModal
        open={open}
        selectedNode={selectedNode}
        onClose={onClose}
        onSubmit={(file, content) =>
        {
          console.log('Received file:', file);
          console.log('Parsed data:', content);
        }}
      />
    );
  }

  if (srcType === 'file')
  {
    return (
      <>
        <FileUploaderModal
          selectedNode={selectedNode}
          open={open}
          onClose={onClose}
          onSubmit={(node, result) => {
            // Prevent duplicate file uploads by checking Redux files state
            const duplicate = files.some(f => f.originalName === result.originalName);
            if (duplicate) {
              setAlertMsg('This file has already been uploaded.');
              setAlertOpen(true);
              onClose();
              return;
            }
            // Prevent duplicate schema node for this file under this parent
            const schemaNodeExists = nodes.some(n => n.data?.parentId === node.id && n.type === 'schemaNode' && n.data?.sourceName === result.originalName);
            if (schemaNodeExists) {
              setAlertMsg('A schema node for this file already exists.');
              setAlertOpen(true);
              onClose();
              return;
            }
            dispatch(addFile(result));
            const schemaFields = Object.keys(result.content[0]);
            // Get all schemaNode siblings (excluding the new one to be added)
            const siblings = nodes.filter(n => n.data?.parentId === node.id && n.type === 'schemaNode');
            const siblingCount = siblings.length + 1;
            const spacing = 400;
            const baseX = node.position.x - ((siblingCount - 1) * spacing) / 2;
            // Update positions of existing siblings (use updateNode, not addNode)
            siblings.forEach((sibling, idx) => {
              dispatch({
                type: 'nodes/updateNode',
                payload: {
                  ...sibling,
                  position: {
                    x: baseX + idx * spacing,
                    y: node.position.y + 150,
                  },
                },
              });
            });
            // Position for the new child node
            const childNodeId = `schemaNode-${Date.now()}`;
            const childNode = {
              id: childNodeId,
              type: 'schemaNode',
              position: {
                x: baseX + (siblingCount - 1) * spacing,
                y: node.position.y + 150,
              },
              data: {
                label: 'schemaNode',
                schema: schemaFields,
                parentId: node.id,
                sourceName: result.originalName,
                parentType: node.data?.label || 'unknown',
              },
            };
            const edge = {
              id: `edge-${node.id}-${childNodeId}`,
              source: node.id,
              target: childNodeId,
              type: 'custom',
            };
            dispatch(addNode(childNode));
            dispatch(addEdge(edge));
            onClose();
          }}
        />
        <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMsg} />
      </>
    );
  }

  return null;
};

export default NodeModals;
