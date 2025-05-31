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
  const etlNodeIds = useMemo(
    () => nodes.filter(n => n.type === 'etlTransformNode' || n.type === 'etlLoadNode').map(n => n.id),
    [nodes]
  );
  // Is there an edge from this field to any ETL node?
  const isEtlConnected = edges.some(e =>
    e.source === nodeId && e.sourceHandle === fieldId && etlNodeIds.includes(e.target)
  );
  // The handle is green if connected to any ETL node, else blue if connected elsewhere, else default
  const handleColor = isEtlConnected ? '#43a047' : (isConnected ? '#1976d2' : '#bdbdbd');

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
    </ListItem>
  );
};

export default SchemaFieldItem;