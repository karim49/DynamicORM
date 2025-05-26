import React from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {sendSchemaDataApi} from '../api/nodeHelpers';
import { addNode } from '../../store/slices/nodesSlice';
import { addEdge } from '../../store/slices/edgesSlice';

const IntegrateSchemas = ({ setAlertMsg, setAlertOpen }) => {
  const nodes = useSelector(state => state.nodes);
  const dispatch = useDispatch();

  const handleClick = async () => {
    const selectedSchemas = nodes.filter(
      (node) => node.type === 'schemaNode' && node.data?.isSourceSelected
    );
    if (selectedSchemas.length < 2) {
      if (setAlertMsg && setAlertOpen) {
        setAlertMsg('Please select at least two schemas to integrate.');
        setAlertOpen(true);
      }
      return;
    }
    // Build payload: for each selected schema, send only schema selection and parent info
    const payload = selectedSchemas.map(node => ({
      nodeId: node.id,
      parentId: node.data.parentId,
      sourceName: node.data.sourceName,
      parentType: node.data.parentType,
      schema: node.data.schema,
      // You can add more hierarchy info if needed
    }));
    try {
      const res = await sendSchemaDataApi(payload);
      // res: { combinedFields, parents }
      // Calculate position between parents
      const parentNodes = nodes.filter(n => res.parents.includes(n.id));
      let avgX = 400, avgY = 300;
      if (parentNodes.length) {
        avgX = parentNodes.reduce((sum, n) => sum + (n.position?.x || 0), 0) / parentNodes.length;
        avgY = parentNodes.reduce((sum, n) => sum + (n.position?.y || 0), 0) / parentNodes.length + 250;
      }
      const integratedNodeId = `integratedNode-${Date.now()}`;
      const integratedNode = {
        id: integratedNodeId,
        type: 'integratedSchemaNode',
        position: {
          x: avgX,
          y: avgY,
        },
        data: {
          label: 'Integrated Schema',
          schema: res.combinedFields,
          parentIds: res.parents,
          parentId: res.roots && res.roots.length > 0 ? res.roots[0] : null, // for move logic
        },
      };
      dispatch(addNode(integratedNode));
      res.parents.forEach((parentId) => {
        dispatch(addEdge({
          id: `edge-${parentId}-${integratedNodeId}`,
          source: parentId,
          sourceHandle: 'source',
          target: integratedNodeId,
          targetHandle: 'target',
          type: 'custom',
        }));
      });
      console.log('Integrated node:', integratedNode);
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

export default IntegrateSchemas;