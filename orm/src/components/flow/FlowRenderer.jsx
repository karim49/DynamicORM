import React, { useCallback, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import IntegrateSchemas from './IntegrateSchemas';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { setNodes, addNode } from '../../store/slices/nodesSlice';
import { setEdges } from '../../store/slices/edgesSlice';
import { setSelectedNode, setOpenModal } from '../../store/slices/uiSlice';
import { removeFile } from '../../store/slices/filesSlice';



const FlowRenderer = ({ setAlertMsg, setAlertOpen }) =>
{
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();

  // Helper: recursively collect all descendants (targets) of a node
  const findAllDescendants = useCallback((startId) => {
    const descendants = new Set();
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift();
      edges.forEach(edge => {
        if (edge.source === current && !descendants.has(edge.target)) {
          descendants.add(edge.target);
          queue.push(edge.target);
        }
      });
    }
    return Array.from(descendants);
  }, [edges]);

  const onNodesChange = useCallback(
    (changes) => {
      // Find all position changes
      const posChanges = changes.filter((c) => c.type === 'position' && c.position);
      if (posChanges.length > 0) {
        let updatedNodes = [...nodes];
        // If any node is moved, move all nodes connected to it as a group
        posChanges.forEach((change) => {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (!node) return;
          const dx = change.position.x - node.position.x;
          const dy = change.position.y - node.position.y;
          // Check if node is a source (has outgoing edges)
          const isSource = edges.some(e => e.source === node.id);
          if (isSource) {
            // Move all descendants (targets) with the source
            const descendants = findAllDescendants(node.id);
            updatedNodes = updatedNodes.map(n =>
              n.id === node.id || descendants.includes(n.id)
                ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
                : n
            );
          } else {
            // Only move the node itself
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
    [dispatch, nodes, edges, findAllDescendants]
  );

  const onEdgesChange = useCallback(
    (changes) =>
    {
      dispatch(setEdges(applyEdgeChanges(changes, edges)));
    },
    [dispatch, edges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      if (event.target.closest('.delete-icon')) return;
      if (node?.type === 'SchemaNode') return;
      // Remove non-serializable fields before storing in Redux
      const { data, ...rest } = node;
      // eslint-disable-next-line no-unused-vars
      const { onDeleteNode, ...serializableData } = data || {};
      dispatch(setSelectedNode({ ...rest, data: serializableData }));
      dispatch(setOpenModal(true));
    },
    [dispatch]
  );

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      // Collect all nodes to delete (including descendants)
      const toDelete = new Set();
      const collectDescendants = (id) => {
        toDelete.add(id);
        edges.forEach(edge => {
          if (edge.source === id && !toDelete.has(edge.target)) {
            collectDescendants(edge.target);
          }
        });
      };
      deletedNodes.forEach(node => collectDescendants(node.id));

      // Remove nodes and edges connected to deleted nodes
      const remainingNodes = nodes.filter(node => !toDelete.has(node.id));
      const remainingEdges = edges.filter(
        edge => !toDelete.has(edge.source) && !toDelete.has(edge.target)
      );

      // --- Remove uploaded file for every deleted schema node (including descendants) ---
      nodes.filter(n => toDelete.has(n.id) && n.type === 'schemaNode' && n.data?.sourceName)
        .forEach(n => dispatch(removeFile(n.data.sourceName)));

      // --- If any deleted node is a transform or load node, reset ALL schema node selectedFields to [] and force UI update ---
      // (ETL node: etlTransformNode or etlLoadNode)
      const deletedEtl = deletedNodes.some(n => n.type === 'etlTransformNode' || n.type === 'etlLoadNode');
      let updatedNodes = remainingNodes;
      if (deletedEtl) {
        updatedNodes = remainingNodes.map(node => {
          if (node.type === 'schemaNode') {
            // Also force a new array reference for selectedFields to trigger React update
            return {
              ...node,
              data: {
                ...node.data,
                selectedFields: [],
              },
            };
          }
          return node;
        });
      } else {
        // If not ETL node, recompute selectedFields based on remaining edges
        updatedNodes = remainingNodes.map(node => {
          if (node.type === 'schemaNode') {
            const schemaFields = Array.isArray(node.data.schema) ? node.data.schema : [];
            const filteredFields = schemaFields.filter(field => {
              const fieldId = typeof field === 'object' && field !== null ? field.field : String(field);
              return remainingEdges.some(e => e.source === node.id && e.sourceHandle === fieldId);
            });
            // Always return a new array reference
            return {
              ...node,
              data: {
                ...node.data,
                selectedFields: [...filteredFields],
              },
            };
          }
          return node;
        });
      }
      // Force a new array reference for nodes to ensure React/Redux update
      dispatch(setNodes([...updatedNodes]));
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

  // Centralized node delete handler
  const onDeleteNode = useCallback((id) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    // Call onNodesDelete with the node and its type
    onNodesDelete([{ id: node.id, type: node.type }]);
  }, [nodes, onNodesDelete]);

  // Helper to inject onDeleteNode into node data for rendering only
  const nodesWithDelete = nodes.map(node => {
    // Never mutate the Redux state! Only inject for rendering
    return {
      ...node,
      data: { ...node.data, onDeleteNode },
    };
  });

  // Pass alert handlers to IntegrateSchemas
  return (
    <div style={{ width: '100%', height: '100%' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodesWithDelete}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesDelete={onNodesDelete}
        onConnect={(params) => {
          // Find the target node to determine its type
          const targetNode = nodes.find(n => n.id === params.target);
          if (targetNode && targetNode.type === 'etlTransformNode') {
            const label = targetNode.data?.label?.toLowerCase?.() || '';
            if (label === 'replace') {
              // Count how many edges already connect to this node
              const incoming = edges.filter(e => e.target === params.target && e.targetHandle === 'etl-input');
              if (incoming.length >= 1) {
                if (setAlertMsg && setAlertOpen) {
                  setAlertMsg('Replace transform can only be connected to one source field.');
                  setAlertOpen(true);
                }
                return; // Prevent connection
              }
            }
            // Add more transform type rules here if needed
          }
          // If connecting from a schema field, ensure targetHandle is 'etl-input'
          const edge = {
            id: `edge-${Date.now()}-${Math.random()}`,
            ...params,
            type: 'customEtlEdge',
            targetHandle: 'etl-input',
          };
          dispatch(setEdges([...edges, edge]));
        }}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap />
        <Controls />
        <Background color="green" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowRenderer;