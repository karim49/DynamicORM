import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';
import { useDispatch } from 'react-redux';
import { removeEdge } from '../../store/slices/edgesSlice';

const CustomEtlEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
 
   const dispatch = useDispatch();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    centerX: true,
  });
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  return (
    <g className="etl-edge-group">
      <BaseEdge
        id={id}
        path={edgePath}
        className="custom-edge"
        style={{ stroke: '#1976d2', strokeWidth: 2, pointerEvents: 'stroke', ...style }}
        markerEnd={markerEnd}
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={7}
        fill="#e3f2fd"
        stroke="#1976d2"
        strokeWidth={3}
        style={{ filter: 'drop-shadow(0 0 2px #1976d2)' }}
      />
           {/* Delete button at the midpoint of the edge */}
            <foreignObject x={midX - 10} y={midY - 10} width={20} height={20} style={{ cursor: 'pointer' }}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(removeEdge(id));
                }}
                style={{
                  width: 20,
                  height: 20,
                  background: '#fff',
                  border: '1px solid #b71c1c',
                  borderRadius: '50%',
                  color: '#b71c1c',
                  fontWeight: 'bold',
                  fontSize: 12,
                  lineHeight: '18px',
                  textAlign: 'center',
                  padding: 0,
                  boxShadow: '0 1px 4px #888',
                }}
                title="Delete edge"
              >
                ×
              </button>
            </foreignObject>
    </g>
  );
};

export default CustomEtlEdge;
