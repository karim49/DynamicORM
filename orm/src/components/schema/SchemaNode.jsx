import React, { useState, useRef, useLayoutEffect } from 'react';
import { Handle, useNodeId, useReactFlow } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Checkbox } from '@mui/material';
import SchemaFieldList from './SchemaFieldList';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { updateNode } from '../../store/slices/nodesSlice';

const SchemaNode = ({ id, data, viewOnly = false }) =>
{
  // Always call hooks in the same order
  const reactFlowNodeId = useNodeId();
  const nodeId = id !== undefined ? id : reactFlowNodeId;
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const [checked, setChecked] = useState(data.selectedFields || []);
  const [isSourceSelected, setIsSourceSelected] = useState(!!data.isSourceSelected);
  const { setNodes } = useReactFlow();
  const headerRef = useRef(null);

  useLayoutEffect(() =>
  {
    if (headerRef.current)
    {
      // const measured = headerRef.current.offsetHeight;
      // setHeaderHeight(measured > 0 ? measured : 40);
    }
  }, [viewOnly]);

  // Sync checked state with Redux node data (selectedFields)
  React.useEffect(() =>
  {
    setChecked(data.selectedFields || []);
  }, [data.selectedFields]);

  const handleToggle = (field) =>
  {
    setChecked((prev) =>
    {
      const newChecked = prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field];
      // Persist selected fields in Redux node data
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? {
              ...node,
              data: {
                ...node.data,
                selectedFields: newChecked,
              },
            }
            : node
        )
      );
      return newChecked;
    });
  };

  const handleMainToggle = () =>
  {
    setIsSourceSelected((prev) =>
    {
      const newVal = !prev;
      // Persist to Redux (update only isSourceSelected)
      const node = nodes.find(n => n.id === nodeId);
      if (node)
      {
        dispatch(updateNode({
          ...node,
          data: {
            ...node.data,
            isSourceSelected: newVal,
          },
        }));
      }
      return newVal;
    });
  };

  return (
    <Box
      sx={{
        padding: 2.5,
        border: '1.5px solid #e0e3e7',
        borderRadius: 14,
        background: 'linear-gradient(135deg, #f0f4c3 0%, #e3f2fd 60%, #e3f0ff 100%)',
        minWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        userSelect: 'none',
        position: 'relative',
        boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12), 0 0.5px 1.5px 0 #fff inset',
        maxWidth: 400,
        maxHeight: 500,
        mb: 1,
        borderTop: '3px solid #fff59d',
        borderLeft: '3px solid #fff',
        borderRight: '3px solid #b0b8c1',
        borderBottom: '3px solid #b0b8c1',
        transition: 'transform 0.18s, box-shadow 0.18s',
        '&:hover': {
          transform: 'scale(1.045) translateY(-2px)',
          boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1} ref={headerRef}>
        {!viewOnly && (
          <Checkbox
            checked={isSourceSelected}
            onChange={handleMainToggle}
            size="small"
            sx={{ color: '#1976d2' }}
          />
        )}
        <Typography
          variant="h6"
          sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d323c', textAlign: 'center', flex: 1 }}
        >
          {data.sourceName}
        </Typography>
        {!viewOnly && (
          <IconButton
            className="delete-icon"
            size="small"
            onClick={e => {
              e.stopPropagation();
              data.onDeleteNode?.(nodeId);
            }}
            aria-label="Delete node"
            sx={{ ml: '1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Render the field list (no handles inside) */}
        <SchemaFieldList
          fields={data.schema || []}
          checked={checked}
          onToggle={handleToggle}
          viewOnly={viewOnly}
        />
      </Box>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" id="source" />
    </Box>
  );
};

export default SchemaNode;
