import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';
import { useDispatch } from 'react-redux';
import { removeEdge } from '../../store/slices/edgesSlice';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
  const dispatch = useDispatch();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    centerX: true,
  });


  return (
    <g className="custom-edge-group">
      <BaseEdge
        id={id}
        path={edgePath}
        className="custom-edge"
        style={{ stroke: '#555', strokeWidth: 2, pointerEvents: 'stroke', ...style }}
        markerEnd={markerEnd}
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={7}
        fill="#fffde7"
        stroke="#fbc02d"
        strokeWidth={1}
        style={{ filter: 'drop-shadow(0 0 2px #fbc02d)' }}
      />
    </g>
  );
};

export default CustomEdge;
