import React, { useMemo } from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';
import { Handle, useNodeId } from 'reactflow';
import { useSelector } from 'react-redux';

const SchemaFieldItem = ({ field, checked, onToggle, viewOnly = false }) => {
  const nodeId = useNodeId();
  const edges = useSelector(state => state.edges);
  const fieldId = typeof field === 'object' && field !== null ? field.field : String(field);
  // Check if this field's handle is connected (outgoing edge from this node and handle)
  const isConnected = edges.some(e => e.source === nodeId && e.sourceHandle === fieldId);
  // The checkbox should be checked ONLY if selected by user or if connected
  const displayChecked = !!isConnected || !!checked;

  // Check if this field's handle is connected to any ETL node (etlTransformNode or etlLoadNode)
  const nodes = useSelector(state => state.nodes);
  // Memoize etlNodeIds to avoid selector warning
  const memoizedEtlNodeIds = useMemo(
    () => nodes.filter(n => n.type === 'etlTransformNode' || n.type === 'etlLoadNode').map(n => n.id),
    [nodes]
  );
  // Is there an edge from this field to any ETL node?
  const isEtlConnected = edges.some(e =>
    e.source === nodeId && e.sourceHandle === fieldId && memoizedEtlNodeIds.includes(e.target)
  );
  // The handle is green if connected to any ETL node, else blue if connected elsewhere, else default
  const handleColor = isEtlConnected ? '#43a047' : isConnected ? '#1976d2' : '#bdbdbd';

  // Memoize etlTransformNodeIds
  const etlTransformNodeIds = useMemo(
    () => nodes.filter(n => n.type === 'etlTransformNode').map(n => n.id),
    [nodes]
  );
  // Find all edges from this field to any etlTransformNode
  const connectedTransformEdges = edges.filter(e =>
    e.source === nodeId &&
    e.sourceHandle === fieldId &&
    etlTransformNodeIds.includes(e.target)
  );
  // Get the labels for all connected transform nodes
  const transformFunctionLabels = useMemo(
    () => nodes.filter(n => etlTransformNodeIds.includes(n.id)).reduce((acc, n) => {
      if (connectedTransformEdges.some(e => e.target === n.id)) {
        acc.push(n.data?.label || n.type);
      }
      return acc;
    }, []),
    [nodes, etlTransformNodeIds, connectedTransformEdges]
  );
  // Memoize replaceEtlNodeIds
  const replaceEtlNodeIds = useMemo(
    () => nodes.filter(n => n.type === 'etlTransformNode' && n.data?.label?.toLowerCase() === 'replace').map(n => n.id),
    [nodes]
  );
  // Detect if this field is connected to a replace ETL node
  const isConnectedToReplace = edges.some(e =>
    e.source === nodeId &&
    e.sourceHandle === fieldId &&
    replaceEtlNodeIds.includes(e.target) &&
    e.targetHandle === 'etl-input'
  );

  return (
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 32,
        position: 'relative',
        pr: viewOnly ? 2 : 4,
        pl: 1,
      }}
      disableGutters
    >
      {!viewOnly && (
        <Checkbox
          checked={displayChecked}
          onChange={() => onToggle(field)}
          edge="start"
          size="small"
        />
      )}
      <ListItemText primary={fieldId} sx={{ flex: 1, minWidth: 0 }} />
      {!viewOnly && (
        <Handle
          type="source"
          position="right"
          id={fieldId}
          style={{
            width: 12,
            height: 12,
            background: handleColor,
            borderRadius: 6,
            border: '2px solid #fff',
            marginLeft: 8,
            alignSelf: 'center',
            zIndex: 2,
          }}
          isConnectable={true}
        />
      )}
      {!viewOnly && transformFunctionLabels.length > 0 && (
        <span style={{ color: '#fbc02d', fontWeight: 600, marginLeft: 8 }} title={`Connected to: ${transformFunctionLabels.join(', ')}` }>
          ({transformFunctionLabels.join(', ')})
        </span>
      )}
  
    </ListItem>
  );
};

export default SchemaFieldItem;