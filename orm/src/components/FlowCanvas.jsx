import React, { useCallback, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow';

import { Box } from '@mui/material';
import 'reactflow/dist/style.css';

import ConnectionModal from './ConnectionModal';
import FileUploader from './FileUploader';
import { nodeTypes, edgeTypes } from './nodeTypes';

const initialNodes = [];
const initialEdges = [];

const FlowCanvas = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();

    const [selectedNode, setSelectedNode] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleDelete = useCallback((nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    }, [setNodes, setEdges]);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/my-app');
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });


            const newNode = {
                id: `${+new Date()}`,
                type: 'custom',
                position,
                data: {
                    label: `${type} Block`,
                    sourceType: type,
                    onDelete: handleDelete,
                },
            };

            setNodes((nds) => nds.concat(newNode));
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

    const handleNodeClick = useCallback((event, node) => {
        if (event.target.closest('.delete-icon')) return;
        setSelectedNode(node);
        setOpenModal(true);
    }, []);

    const handleCloseModal = () => {
        setSelectedNode(null);
        setOpenModal(false);
    };

    // const handleSubmit = (nodeId, payload) => {
    //     console.log('Submitting:', { nodeId, payload });
    //     handleCloseModal();
    // };

    return (
        <Box style={{ flex: 1, height: '100vh' }} onDrop={onDrop} onDragOver={onDragOver}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>

            {selectedNode && openModal && selectedNode.data?.sourceType !== 'file' && (
                <ConnectionModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedNode={selectedNode}
                    // onSubmit={(value) => handleSubmit(selectedNode.id, { connectionString: value })}
                />
            )}

            {selectedNode && openModal && selectedNode.data?.sourceType === 'file' && (
                <FileUploader
                    open={openModal}
                    onClose={handleCloseModal}
                    // onSubmit={(file) => handleSubmit(selectedNode.id, { file })}
                />
            )}
        </Box>
    );
};

export default FlowCanvas;
