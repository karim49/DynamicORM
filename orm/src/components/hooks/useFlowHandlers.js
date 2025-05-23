import { useCallback } from 'react';
import {useNodesState,useEdgesState,useReactFlow,addEdge,} from 'reactflow';
import { sourceMeta } from '../../lib/sourceMeta';

export default function useFlowHandlers({ setSelectedNode, setOpenModal }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const handleDelete = useCallback(
    (nodeId) => {
      setNodes((nds) => {
        const toDelete = new Set([nodeId]);
        const collectChildren = (id) => {
          nds.forEach((node) => {
            if (node.data?.parentId === id) {
              toDelete.add(node.id);
              collectChildren(node.id);
            }
          });
        };
        collectChildren(nodeId);
        return nds.filter((node) => !toDelete.has(node.id));
      });

      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/my-app');
      const meta = sourceMeta[type];
      if (!meta) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode = {
        id: `${+new Date()}`,
        type: 'custom',
        position,
        data: {
          label: `${meta.label}`,
          sourceType: type,
          category: meta.category,
          modalType: meta.modalType,
          onDelete: handleDelete,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, handleDelete]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges]
  );

  const onNodesChangeWrapper = useCallback(
    (changes) => {
      const posChanges = changes.filter((c) => c.type === 'position' && c.position);
      const otherChanges = changes.filter((c) => c.type !== 'position');

      if (posChanges.length === 0) {
        onNodesChange(changes);
        return;
      }

      setNodes((prevNodes) => {
        let updatedNodes = [...prevNodes];
        posChanges.forEach((change) => {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (!node) return;

          const dx = change.position.x - node.position.x;
          const dy = change.position.y - node.position.y;
          node.position = change.position;

          const moveChildren = (parentId) => {
            updatedNodes = updatedNodes.map((n) => {
              if (n.data?.parentId === parentId) {
                const newPos = {
                  x: n.position.x + dx,
                  y: n.position.y + dy,
                };
                moveChildren(n.id);
                return { ...n, position: newPos };
              }
              return n;
            });
          };
          moveChildren(node.id);
        });
        return updatedNodes;
      });

      if (otherChanges.length > 0) {
        onNodesChange(otherChanges);
      }
    },
    [onNodesChange, setNodes]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      if (event.target.closest('.delete-icon')) return;
      if (node.data?.label === 'SchemaBox') return;
      setSelectedNode(node);
      setOpenModal(true);
    },
    [setSelectedNode, setOpenModal]
  );

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange: onNodesChangeWrapper,
    onEdgesChange,
    onDrop,
    onDragOver,
    onConnect,
    handleNodeClick,
  };
}
