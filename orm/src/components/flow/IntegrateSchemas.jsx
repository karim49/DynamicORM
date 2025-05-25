import React from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import sendSchemaData from '../api/SendSchemaData';
import { addNode } from '../../store/slices/nodesSlice';
import { addEdge } from '../../store/slices/edgesSlice';

const IntegrateSchemas = () => {
  const nodes = useSelector(state => state.nodes);
  const dispatch = useDispatch();

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
      const ancestorsIds = selectedSchemas.map(node => node.data.parentId);
      parentIds = [...parentIds, ...ancestorsIds];
      const integratedNodeWithParents = {
        ...integratedNode,
        type: 'integratedSchemaNode',
        data: {
          ...integratedNode.data,
          parentIds,
        },
      };
      dispatch(addNode(integratedNodeWithParents));
      selectedSchemas.forEach((node) => {
        dispatch(addEdge({
          id: `edge-${node.id}-${integratedNode.id}`,
          source: node.id,
          sourceHandle: 'source',
          target: integratedNode.id,
          targetHandle: 'target',
          type: 'custom',
        }));
      });
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

export default IntegrateSchemas;