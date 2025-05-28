import React, { useCallback, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import IntegrateSchemas from './IntegrateSchemas';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { setNodes, addNode } from '../../store/slices/nodesSlice';
import { setEdges } from '../../store/slices/edgesSlice';
import { setSelectedNode, setOpenModal } from '../../store/slices/uiSlice';



const FlowRenderer = ({ setAlertMsg, setAlertOpen }) =>
{
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => {
      // Custom: If a dataSourceNode moves, move all its descendants by the same delta
      const posChanges = changes.filter((c) => c.type === 'position' && c.position);
      if (posChanges.length > 0) {
        let updatedNodes = [...nodes];
        posChanges.forEach((change) => {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (!node) return;
          // Only apply descendant-move logic to dataSourceNode
          if (node.type === 'dataSourceNode') {
            const dx = change.position.x - node.position.x;
            const dy = change.position.y - node.position.y;
            // Move the parent node
            updatedNodes = updatedNodes.map(n =>
              n.id === node.id ? { ...n, position: { ...change.position } } : n
            );
            // Recursively move all descendants immutably
            const moveChildren = (parentId) => {
              updatedNodes = updatedNodes.map((n) => {
                if (n.data?.parentId === parentId) {
                  const newPos = {
                    x: n.position.x + dx,
                    y: n.position.y + dy,
                  };
                  updatedNodes = moveChildren(n.id);
                  return { ...n, position: newPos };
                }
                return n;
              });
              return updatedNodes;
            };
            updatedNodes = moveChildren(node.id);
          } else {
            // For non-dataSourceNode, just move the node itself (child can move alone)
            updatedNodes = updatedNodes.map(n =>
              n.id === node.id ? { ...n, position: { ...change.position } } : n
            );
          }
        });
        dispatch(setNodes(updatedNodes));
        // Also apply any other changes (like selection etc)
        const otherChanges = changes.filter((c) => c.type !== 'position');
        if (otherChanges.length > 0) {
          dispatch(setNodes(applyNodeChanges(otherChanges, updatedNodes)));
        }
        return;
      }
      // Default: just apply changes
      dispatch(setNodes(applyNodeChanges(changes, nodes)));
    },
    [dispatch, nodes]
  );

  const onEdgesChange = useCallback(
    (changes) =>
    {
      dispatch(setEdges(applyEdgeChanges(changes, edges)));
    },
    [dispatch, edges]
  );

  const onNodeClick = useCallback(
    (event, node) =>
    {
      // Ignore clicks on the delete icon
      if (event.target.closest('.delete-icon')) return;
      // Ignore clicks on nodes with label 'SchemaNode'
      if (node?.type === 'SchemaNode') return;
      // Log the nodes from Redux state
      console.log('Redux nodes:', nodes);
      dispatch(setSelectedNode(node));
      dispatch(setOpenModal(true));
    },
    [dispatch, nodes]
  );

  const onNodesDelete = useCallback(
    (deletedNodes) =>
    {
      // deletedNodes is an array of node objects
      const toDelete = new Set();
      const collectDescendants = (id) =>
      {
        toDelete.add(id);
        edges.forEach(edge =>
        {
          if (edge.source === id && !toDelete.has(edge.target))
          {
            collectDescendants(edge.target);
          }
        });
      };
      deletedNodes.forEach(node => collectDescendants(node.id));

      // Remove nodes
      const remainingNodes = nodes.filter(node => !toDelete.has(node.id));
      dispatch(setNodes(remainingNodes));

      // Remove edges connected to deleted nodes
      const remainingEdges = edges.filter(
        edge => !toDelete.has(edge.source) && !toDelete.has(edge.target)
      );
      dispatch(setEdges(remainingEdges));
    },
    [dispatch, nodes, edges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // Handle ETL Transform
      const etlFn = event.dataTransfer.getData('application/etl-fn');
      if (etlFn) {
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNode = {
          id: `etl-fn-${etlFn}-${Date.now()}`,
          type: 'etlTransformNode',
          position,
          data: { label: etlFn },
        };
        dispatch(addNode(newNode));
        return;
      }
      // Handle ETL Load
      const etlLoad = event.dataTransfer.getData('application/etl-load');
      if (etlLoad) {
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNode = {
          id: `etl-load-${etlLoad}-${Date.now()}`,
          type: 'etlLoadNode',
          position,
          data: { label: etlLoad },
        };
        dispatch(addNode(newNode));
        return;
      }
      // Fallback: handle normal reactflow drag
      const data = event.dataTransfer.getData('application/reactflow');
      if (data) {
        const [type, srcType] = JSON.parse(data);
        if (!type || !srcType) return;
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: `${type}_${+new Date()}`,
          type: 'dataSourceNode',
          position,
          data: { label: `${type}` },
        };
        newNode.data = {
          ...newNode.data, schema: [], parentId: null, sourceName: '',
          srcType: srcType, type: type
        };
        newNode.data = { ...newNode.data, modalType: 'connection' };
        dispatch(addNode(newNode));
      }
    },
    [dispatch, screenToFlowPosition]
  );

  const onDragOver = useCallback((event) =>
  {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  useEffect(() => {
    const handleOpenLoadedSchema = (e) => {
      const { schema, idx } = e.detail;
      // Replace all nodes and edges with just the loaded schema node, in viewOnly/highlight mode
      const newNode = {
        id: `loadedSchema-${Date.now()}-${idx}`,
        type: 'schemaNode',
        position: { x: 300, y: 200 },
        data: {
          label: schema.name || `Schema ${idx + 1}`,
          schema: Array.isArray(schema) ? schema : schema.fields || schema,
          sourceName: schema.name || `Schema ${idx + 1}`,
          viewOnly: true,
          highlight: true,
        },
      };
      dispatch(setNodes([newNode]));
      dispatch(setEdges([]));
    };
    window.addEventListener('openLoadedSchema', handleOpenLoadedSchema);
    return () => window.removeEventListener('openLoadedSchema', handleOpenLoadedSchema);
  }, [dispatch]);

  // Pass alert handlers to IntegrateSchemas
  return (
    <div style={{ width: '100%', height: '100%' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesDelete={onNodesDelete}
        onConnect={(params) => {
          // If connecting from a schema field, ensure targetHandle is 'etl-input'
          const edge = {
            ...params,
            type: 'customEtlEdge',
            targetHandle: 'etl-input',
          };
          dispatch(setEdges([...edges, edge]));
        }}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap />
        <Controls>
        </Controls>
        <Background color="green" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowRenderer;