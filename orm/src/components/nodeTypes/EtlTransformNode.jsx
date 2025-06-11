import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import ReplaceFunctionDialog from '../modal/ReplaceFunctionDialog';
import AggregationFunctionDialog from '../modal/AggregationFunctionDialog';
import FilterFunctionDialog from '../modal/FilterFunctionDialog';
import MapFunctionDialog from '../modal/MapFunctionDialog';
import { useSelector, useDispatch } from 'react-redux';
import { updateNode } from '../../store/slices/nodesSlice';

const EtlTransformNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replaceParams, setReplaceParams] = useState(data?.params || {});
  // Determine dialog type
  const isAggregation = (data.label || '').toLowerCase() === 'aggregation';
  const isFilter = (data.label || '').toLowerCase() === 'filter';
  const isMap = (data.label || '').toLowerCase() === 'map';

  const handleDialogSave = (newParams) => {
    setReplaceParams(newParams);
    setDialogOpen(false);

    // Update node data with new parameters while preserving other node properties
    const sanitizedData = {
      ...data,
      params: {
        ...data.params,
        // Handle parameters based on transform type
        ...(isAggregation ? {
          fields: newParams.fields,
          operation: newParams.operation
        } : isFilter ? {
          field: newParams.field,
          operator: newParams.operator,
          value: newParams.value
        } : isMap ? {
          field: newParams.field,
          expression: newParams.expression
        } : {
          // Replace function parameters
          searchFor: newParams.searchValue,
          replaceWith: newParams.replaceValue
        })
      }
    };
    // Remove non-serializable data
    delete sanitizedData.onDeleteNode;

    // Dispatch updateNode action to update Redux state, preserving node position and other properties
    dispatch(updateNode({
      id,
      data: sanitizedData,
      type: 'etlTransformNode',
      position: nodes.find(n => n.id === id)?.position || { x: 0, y: 0 }
    }));
  };

  // Fetch edges from Redux state
  const edges = useSelector(state => state.edges);

  // Determine connection state dynamically
  const isInputConnected = edges.some(edge => edge.target === id);
  const isOutputConnected = edges.some(edge => edge.source === id);

  const inputHandleStyle = {
    left: 0,
    top: '50%',
    width: 10,
    height: 10,
    background: isInputConnected ? '#43a047' : '#bdbdbd',
    borderRadius: 5,
    border: '2px solid #fff',
  };

  const outputHandleStyle = {
    right: 0,
    top: '50%',
    width: 10,
    height: 10,
    background: isOutputConnected ? '#43a047' : '#bdbdbd',
    borderRadius: 5,
    border: '2px solid #fff',
  };

  return (
    <>
      <Box
        sx={{
          padding: 2.5,
          border: '1.5px solid #e0e3e7',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #e0ecff 0%, #f8fafc 60%, #dbeafe 100%)',
          minWidth: 120,
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          position: 'relative',
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12), 0 0.5px 1.5px 0 #fff inset',
          height: 'auto',
          mb: 1,
          borderTop: '3px solid #b2cfff',
          borderLeft: '3px solid #fff',
          borderRight: '3px solid #b0b8c1',
          borderBottom: '3px solid #b0b8c1',
          cursor: 'pointer',
          transition: 'transform 0.18s, box-shadow 0.18s',
          '&:hover': {
            transform: 'scale(1.045) translateY(-2px)',
            boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
          },
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1976d2', flex: 1 }}>
          {data.label}
        </Typography>
        <IconButton
          className="delete-icon"
          size="small"
          onClick={e => { e.stopPropagation(); data.onDeleteNode?.(id); }}
          aria-label="Delete node"
          sx={{ ml: '1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Handle type="target" position="left" id="etl-input" style={inputHandleStyle} />
        <Handle type="source" position="right" id="etl-output" style={outputHandleStyle} />
      </Box>
      {isAggregation ? (
        <AggregationFunctionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleDialogSave}
          initialFields={replaceParams.fields}
          initialOperation={replaceParams.operation || 'sum'}
          nodeId={id}
        />
      ) : isFilter ? (
        <FilterFunctionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleDialogSave}
          initialField={replaceParams.field}
          initialOperator={replaceParams.operator || '=='}
          initialValue={replaceParams.value || ''}
          nodeId={id}
        />
      ) : isMap ? (
        <MapFunctionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleDialogSave}
          initialField={replaceParams.field}
          initialExpression={replaceParams.expression || ''}
          nodeId={id}
        />
      ) : (
        <ReplaceFunctionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleDialogSave}
          initialValue={replaceParams.input}
          initialSearch={replaceParams.searchValue || ''}
          initialReplace={replaceParams.replaceValue || ''}
          nodeId={id} // Pass current node id
        />
      )}
    </>
  );
};

export default EtlTransformNode;
