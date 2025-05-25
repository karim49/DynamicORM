import React, { useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nodeTypes, edgeTypes } from '../nodeTypes/index';
import IntegrateSchemas from './IntegrateSchemas';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { setNodes, addNode } from '../../store/slices/nodesSlice';
import { setEdges } from '../../store/slices/edgesSlice';
import { setSelectedNode, setOpenModal } from '../../store/slices/uiSlice';



const FlowRenderer = () =>
{
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) =>
    {
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
  (event, node) => {
    // Ignore clicks on the delete icon
    if (event.target.closest('.delete-icon')) return;
    // Ignore clicks on nodes with label 'SchemaNode'
    if (node?.type === 'SchemaNode') return;
    dispatch(setSelectedNode(node));
    dispatch(setOpenModal(true));
  },
  [dispatch]
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
    (event) =>
    {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type) return;

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
      if (type === 'dataSourceNode')
      {
        newNode.data = { ...newNode.data, schema: [], parentId: null, sourceName: '' };
      } else if (type === 'connectionNode')
      {
        newNode.data = { ...newNode.data, modalType: 'connection' };
      } else if (type === 'fileNode')
      {
        newNode.data = { ...newNode.data, modalType: 'file' };
      }
      dispatch(addNode(newNode));
    },
    [dispatch, screenToFlowPosition]
  );

  const onDragOver = useCallback((event) =>
  {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


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
      >
        <MiniMap />
        <Controls>
          <IntegrateSchemas />
        </Controls>
        <Background color="green" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowRenderer;