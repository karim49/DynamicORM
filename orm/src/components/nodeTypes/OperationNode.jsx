import React, { useState } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Handle } from 'reactflow';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import JoinFullIcon from '@mui/icons-material/JoinFull';
import MergeIcon from '@mui/icons-material/Merge';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TransformIcon from '@mui/icons-material/Transform';
import NormalizeDialog from '../dialogs/NormalizeDialog';

const OperationNode = ({ id, data, selected }) => {
  const [showNormalizeDialog, setShowNormalizeDialog] = useState(false);

  const getOperationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'inner':
        return <JoinInnerIcon />;
      case 'left':
        return <JoinFullIcon />;
      case 'right':
        return <JoinFullIcon sx={{ transform: 'scaleX(-1)' }} />;
      case 'full':
        return <MergeIcon />;
      case 'union':
        return <CompareArrowsIcon />;
      case 'normalize':
        return <TransformIcon />;
      default:
        return <JoinInnerIcon />;
    }
  };

  const handleClick = (e) => {
    if (data?.operationType === 'normalize') {
      e.stopPropagation();
      setShowNormalizeDialog(true);
    }
  };

  const isNormalizeOperation = data?.operationType === 'normalize';

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          padding: 2.5,
          border: '1.5px solid #e0e3e7',
          borderRadius: 12,
          background: selected 
            ? 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)'
            : 'linear-gradient(135deg, #357abd 0%, #2c6aa0 100%)',
          minWidth: 120,
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          position: 'relative',
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.22), 0 2px 8px 0 rgba(60,72,100,0.12)',
          height: 'auto',
          mb: 1,
          color: '#fff',
          cursor: isNormalizeOperation ? 'pointer' : 'default',
          transition: 'transform 0.18s, box-shadow 0.18s',
          '&:hover': isNormalizeOperation ? {
            transform: 'scale(1.045) translateY(-2px)',
            boxShadow: '0 16px 48px 0 rgba(60,72,100,0.28), 0 6px 18px 0 rgba(60,72,100,0.18)',
          } : {},
        }}
      >
        {getOperationIcon(data?.operationType)}
        <Typography sx={{ ml: 1, fontSize: '1.1rem', fontWeight: 700, flex: 1 }}>
          {data?.operationType?.charAt(0).toUpperCase() + data?.operationType?.slice(1)}
          {!isNormalizeOperation && ' Join'}
        </Typography>
        <IconButton
          className="delete-icon"
          size="small"
          onClick={e => { e.stopPropagation(); data.onDeleteNode?.(id); }}
          aria-label="Delete node"
          sx={{ ml: '1rem', color: '#fff', '&:hover': { color: '#ff4444', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        {isNormalizeOperation ? (
          <>
            {/* Input for normalize operation */}
            <Tooltip title="Input Fields" placement="left">
              <Handle
                type="target"
                position="left"
                id="input"
                style={{
                  width: 10,
                  height: 10,
                  background: '#90caf9',
                  borderRadius: 5,
                  border: '2px solid #fff',
                }}
              />
            </Tooltip>
            {/* Output for normalize operation */}
            <Tooltip title="Output" placement="right">
              <Handle
                type="source"
                position="right"
                id="output"
                style={{
                  width: 10,
                  height: 10,
                  background: '#4caf50',
                  borderRadius: 5,
                  border: '2px solid #fff',
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            {/* Left Schema Input */}
            <Tooltip title="Left Schema" placement="left">
              <Handle
                type="target"
                position="left"
                id="left-schema"
                style={{
                  width: 10,
                  height: 10,
                  background: '#90caf9',
                  borderRadius: 5,
                  border: '2px solid #fff',
                }}
              />
            </Tooltip>

            {/* Right Schema Input */}
            <Tooltip title="Right Schema" placement="right">
              <Handle
                type="target"
                position="right"
                id="right-schema"
                style={{
                  width: 10,
                  height: 10,
                  background: '#90caf9',
                  borderRadius: 5,
                  border: '2px solid #fff',
                }}
              />
            </Tooltip>

            {/* Output */}
            <Tooltip title="Output" placement="bottom">
              <Handle
                type="source"
                position="bottom"
                id="output"
                style={{
                  width: 10,
                  height: 10,
                  background: '#4caf50',
                  borderRadius: 5,
                  border: '2px solid #fff',
                }}
              />
            </Tooltip>
          </>
        )}
      </Box>

      <NormalizeDialog
        open={showNormalizeDialog}
        onClose={() => setShowNormalizeDialog(false)}
        nodeId={id}
      />
    </>
  );
};

export default OperationNode; 