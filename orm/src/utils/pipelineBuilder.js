// src/utils/pipelineBuilder.js
// Utility to extract pipeline structure from nodes and edges in the flow

/**
 * Build a pipeline structure from nodes and edges
 * @param {Array} nodes - All nodes in the flow
 * @param {Array} edges - All edges in the flow
 * @returns {Object} pipeline structure
 */
export function buildPipeline(nodes, edges) {
  // Find data source node
  const dataSource = nodes.find(n => n.type === 'dataSourceNode');
  // Find schema node(s) connected to data source
  const schemaNodes = nodes.filter(n => n.type === 'schemaNode');
  // Find load node
  const loadNode = nodes.find(n => n.type === 'etlLoadNode');
  // Find all transform nodes
  const etlTransforms = nodes.filter(n => n.type === 'etlTransformNode');

  // Map field connections
  const fieldMappings = [];
  schemaNodes.forEach(schemaNode => {
    const schemaFields = schemaNode.data?.schema || [];
    (schemaNode.data?.selectedFields || schemaFields).forEach(field => {
      // Find edge from this field (by handle) to next node
      const edge = edges.find(e => e.source === schemaNode.id && e.sourceHandle === (field.field || field));
      if (edge) {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode?.type === 'etlTransformNode') {
          // Find edge from transform to load
          const outEdge = edges.find(e2 => e2.source === targetNode.id && e2.target === loadNode?.id);
          fieldMappings.push({
            field: field.field || field,
            from: schemaNode.id,
            transform: {
              nodeId: targetNode.id,
              function: targetNode.data?.label,
              params: targetNode.data?.params || {},
            },
            to: loadNode?.id,
            viaTransform: true,
          });
        } else if (targetNode?.type === 'etlLoadNode') {
          fieldMappings.push({
            field: field.field || field,
            from: schemaNode.id,
            transform: null,
            to: loadNode.id,
            viaTransform: false,
          });
        }
      }
    });
  });

  return {
    dataSource: dataSource ? {
      id: dataSource.id,
      type: dataSource.data?.sourceType || dataSource.data?.type,
      connection: dataSource.data?.connectionString,
      schema: dataSource.data?.schema,
      selectedFields: schemaNodes.flatMap(n => n.data?.selectedFields || []),
    } : null,
    pipeline: fieldMappings,
    load: loadNode ? {
      id: loadNode.id,
      type: loadNode.data?.mode || 'file',
      path: loadNode.data?.dir,
      fileName: loadNode.data?.fileName,
      connection: loadNode.data?.connString,
      dbName: loadNode.data?.dbName,
    } : null,
  };
}
