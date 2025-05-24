import React, { useState } from 'react';
import { Handle, useNodeId, useReactFlow } from 'reactflow';
import { Box, Typography, Checkbox } from '@mui/material';
import SchemaFieldList from './SchemaFieldList';

const SchemaNode = ({ data }) => {
  // const { schema = [], label = 'Schema Node' } = data;
  const { schema = [] } = data;

  const [checked, setChecked] = useState([]);
  const [isSourceSelected, setIsSourceSelected] = useState(false); // for the main box
  const nodeId = useNodeId();
  const { setNodes } = useReactFlow();

  const handleToggle = (field) => {
    setChecked((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleMainToggle = () => {
    setIsSourceSelected((prev) => !prev);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              isSourceSelected: !node.data.isSourceSelected,
            },
          }
          : node
      )
    );
  };

  // const handleMainToggle = () => {
  //   setIsSourceSelected((prev) => !prev);
  // };

  return (
    <Box
      sx={{
        padding: 2,
        // border: '2px solid #4caf50',
        borderRadius: 2,
        // backgroundColor: '#e8f5e9',
        backgroundColor: isSourceSelected ? 'rgba(234, 190, 57, 0.33)' : 'rgba(129, 220, 214, 0.61)',
        border: isSourceSelected ? '2px solid rgba(198, 163, 74, 0.67)' : '2px solid rgb(76, 175, 168)',
        minWidth: 150,
        position: 'relative',
        maxWidth: 400,
        maxHeight: 500,
        overflowY: 'auto',
        scrollbarWidth: 'thin',

      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Checkbox
          checked={isSourceSelected}
          onChange={handleMainToggle}
          size="small"
        />
        <Typography
          variant="h6" sx={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', mt: -1, mb: -1, }}
        >
          {data.sourceName}
        </Typography>
      </Box>
      <SchemaFieldList
        fields={schema}
        checked={checked}
        onToggle={handleToggle}
      />

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </Box>
  );
};

export default SchemaNode;
