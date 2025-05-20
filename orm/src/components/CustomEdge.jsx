import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#555', strokeWidth: 2, ...style }}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default CustomEdge;
