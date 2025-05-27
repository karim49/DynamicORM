import React, { useState } from 'react';
import { Handle, useNodeId, useReactFlow } from 'reactflow';
import { Box, Typography, Checkbox } from '@mui/material';
import SchemaFieldList from './SchemaFieldList';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import { removeFile } from '../../store/slices/filesSlice';
import { useSelector } from 'react-redux';
import { updateNode } from '../../store/slices/nodesSlice';

const SchemaNode = ({ data, viewOnly = false, highlight = false }) =>
{
  const { deleteElements } = useReactFlow();
  const nodeId = useNodeId();
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const handleDelete = () =>
  {
    deleteElements({ nodes: [{ id: nodeId }] });
    // Remove file from Redux if this schema node represents a file
    if (data.sourceName) {
      dispatch(removeFile(data.sourceName));
    }
  };
  const { schema = [] } = data;

  const [checked, setChecked] = useState(data.selectedFields || []);
  const [isSourceSelected, setIsSourceSelected] = useState(!!data.isSourceSelected); // for the main box
  const { setNodes } = useReactFlow();

  const handleToggle = (field) =>
  {
    setChecked((prev) => {
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
    setIsSourceSelected((prev) => {
      const newVal = !prev;
      // Persist to Redux (update only isSourceSelected)
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
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
        padding: 2,
        border: '1px solid #e0e3e7',
        borderRadius: 3,
        backgroundColor: highlight ? 'rgba(56, 142, 60, 0.15)' : (isSourceSelected ? 'rgba(234, 190, 57, 0.10)' : '#fff'),
        minWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        userSelect: 'none',
        position: 'relative',
        boxShadow: 2,
        maxWidth: 400,
        maxHeight: 500,
        overflowY: 'auto',
        mb: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
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
              handleDelete();
            }}
            aria-label="Delete node"
            sx={{ ml: '1rem', color: '#b71c1c', '&:hover': { color: '#f44336', bgcolor: '#fbe9e7' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <SchemaFieldList
        fields={schema}
        checked={checked}
        onToggle={handleToggle}
        viewOnly={viewOnly}
      />
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default SchemaNode;
