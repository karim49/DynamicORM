// src/utils/pipelineBuilder.js
// Utility to extract pipeline structure from nodes and edges in the flow

/**
 * Build a pipeline structure from nodes and edges
 * @param {Array} nodes - All nodes in the flow
 * @param {Array} edges - All edges in the flow
 * @returns {Object} pipeline structure
 */
export function buildPipeline(nodes, edges) {
  // Find all data source nodes
  const dataSources = nodes.filter(n => n.type === 'dataSourceNode');
  // Find schema nodes
  const schemaNodes = nodes.filter(n => n.type === 'schemaNode');
  // Find operation nodes
  const operationNodes = nodes.filter(n => n.type === 'operationNode');
  // Find load node
  const loadNode = nodes.find(n => n.type === 'etlLoadNode');

  // Helper function to check if a field has a complete path to load node
  const hasPathToLoad = (schemaNode, fieldId, visited = new Set()) => {
    // Find all edges from this field
    const fieldEdges = edges.filter(e => e.source === schemaNode.id && e.sourceHandle === fieldId);
    
    for (const edge of fieldEdges) {
      if (visited.has(edge.target)) continue; // Avoid cycles
      visited.add(edge.target);
      
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!targetNode) continue;

      // If directly connected to load node
      if (targetNode.type === 'etlLoadNode') {
        return true;
      }

      // If connected to transform node or operation node, check if it's connected to load
      if (targetNode.type === 'etlTransformNode' || targetNode.type === 'operationNode') {
        const nextEdges = edges.filter(e => e.source === targetNode.id);
        for (const nextEdge of nextEdges) {
          if (hasPathToLoad({ id: targetNode.id }, nextEdge.sourceHandle, visited)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Helper function to get normalized field name if it exists
  const getNormalizedFieldName = (schemaNode, fieldId) => {
    const fieldEdges = edges.filter(e => e.source === schemaNode.id && e.sourceHandle === fieldId);
    for (const edge of fieldEdges) {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode?.type === 'operationNode' && targetNode.data?.operationType === 'normalize') {
        return targetNode.data?.fieldMappings?.[fieldId] || fieldId;
      }
    }
    return fieldId;
  };

  // Map field connections
  const fieldMappings = [];
  schemaNodes.forEach(schemaNode => {
    // Get all fields from the schema
    const schemaFields = schemaNode.data?.schema || [];
    
    // Process each field that has an outgoing connection
    schemaFields.forEach(field => {
      const fieldId = typeof field === 'object' ? field.field : field;
      
      // Only process fields that have a complete path to load node
      if (!hasPathToLoad(schemaNode, fieldId)) return;

      // Get normalized field name if it exists
      const normalizedFieldName = getNormalizedFieldName(schemaNode, fieldId);

      // Find all edges from this field
      const fieldEdges = edges.filter(e => e.source === schemaNode.id && e.sourceHandle === fieldId);
      
      fieldEdges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!targetNode) return; // Skip if target node not found

        if (targetNode.type === 'etlTransformNode') {
          // Field is connected to a transform node
          fieldMappings.push({
            field: normalizedFieldName, // Use normalized name
            originalField: fieldId,
            from: schemaNode.id,
            schemaId: schemaNode.id,
            sourceId: schemaNode.data?.parentId,
            sourceName: schemaNode.data?.sourceName || '',
            transform: {
              nodeId: targetNode.id,
              function: targetNode.data?.label || 'Unknown',
              params: targetNode.data?.params || {},
              functionType: targetNode.data?.label?.toLowerCase() || 'unknown',
              inputField: normalizedFieldName // Use normalized name
            },
            to: loadNode?.id || null,
            viaTransform: true,
          });
        } else if (targetNode.type === 'operationNode' && targetNode.data?.operationType === 'normalize') {
          // Field is connected to a normalize operation
          fieldMappings.push({
            field: normalizedFieldName,
            originalField: fieldId,
            from: schemaNode.id,
            schemaId: schemaNode.id,
            sourceId: schemaNode.data?.parentId,
            sourceName: schemaNode.data?.sourceName || '',
            normalize: {
              nodeId: targetNode.id,
              originalField: fieldId,
              newField: normalizedFieldName
            },
            to: loadNode?.id || null,
            viaNormalize: true,
          });
        } else if (targetNode.type === 'operationNode') {
          // Field is connected to an operation node (joins, etc)
          fieldMappings.push({
            field: normalizedFieldName, // Use normalized name
            originalField: fieldId,
            from: schemaNode.id,
            schemaId: schemaNode.id,
            sourceId: schemaNode.data?.parentId,
            sourceName: schemaNode.data?.sourceName || '',
            operation: {
              nodeId: targetNode.id,
              type: targetNode.data?.operationType || 'unknown',
              side: edge.targetHandle === 'left-schema' ? 'left' : 'right',
              joinField: normalizedFieldName // Use normalized name
            },
            to: loadNode?.id || null,
            viaOperation: true,
          });
        } else if (targetNode.type === 'etlLoadNode') {
          // Field is directly connected to load node
          fieldMappings.push({
            field: normalizedFieldName, // Use normalized name
            originalField: fieldId,
            from: schemaNode.id,
            schemaId: schemaNode.id,
            sourceId: schemaNode.data?.parentId,
            sourceName: schemaNode.data?.sourceName || '',
            transform: null,
            to: targetNode.id,
            viaTransform: false,
          });
        }
      });
    });
  });

  // Map operations
  const operations = operationNodes.map(node => {
    if (node.data?.operationType === 'normalize') {
      // For normalize operations, collect all incoming edges and their field mappings
      const incomingEdges = edges.filter(e => e.target === node.id);
      const fieldMappings = {};
      incomingEdges.forEach(edge => {
        const sourceField = edge.sourceHandle;
        const normalizedField = node.data?.fieldMappings?.[sourceField] || sourceField;
        fieldMappings[sourceField] = normalizedField;
      });

      return {
        id: node.id,
        type: 'normalize',
        fieldMappings,
        sourceNode: incomingEdges[0]?.source || null,
        outputFields: Object.values(fieldMappings)
      };
    } else {
      // For join operations
      const leftSchema = edges.find(e => e.target === node.id && e.targetHandle === 'left-schema');
      const rightSchema = edges.find(e => e.target === node.id && e.targetHandle === 'right-schema');

      // Find the actual source schema nodes by traversing through normalize nodes if needed
      const getSourceSchema = (edge) => {
        if (!edge) return null;
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (!sourceNode) return null;

        if (sourceNode.type === 'operationNode' && sourceNode.data?.operationType === 'normalize') {
          // If coming from a normalize node, get its source schema
          const normalizeSource = edges.find(e => e.target === sourceNode.id)?.source;
          return normalizeSource || null;
        }
        return sourceNode.id;
      };

      // Get the actual field names (considering normalization)
      const getFieldName = (edge) => {
        if (!edge) return null;
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (!sourceNode) return null;

        if (sourceNode.type === 'operationNode' && sourceNode.data?.operationType === 'normalize') {
          // If coming from a normalize node, get the normalized field name
          const originalField = edge.sourceHandle;
          return sourceNode.data?.fieldMappings?.[originalField] || originalField;
        }
        return edge.sourceHandle;
      };

      return {
        id: node.id,
        type: node.data?.operationType || 'unknown',
        leftSchema: getSourceSchema(leftSchema),
        rightSchema: getSourceSchema(rightSchema),
        leftField: getFieldName(leftSchema),
        rightField: getFieldName(rightSchema)
      };
    }
  });

  // Group schemas by data source
  const dataSourcesInfo = dataSources.map(dataSource => {
    const connectedSchemas = schemaNodes
      .filter(schema => edges.some(e => e.source === dataSource.id && e.target === schema.id))
      .map(schema => {
        const allFields = schema.data?.schema || [];
        const selectedFields = schema.data?.checkedFields || [];
        const normalizedSelectedFields = selectedFields.map(field => {
          const fieldId = typeof field === 'object' ? field.field : field;
          return getNormalizedFieldName(schema, fieldId);
        });
        
        return {
          id: schema.id,
          allFields: allFields,
          selectedFields: normalizedSelectedFields,
          originalSelectedFields: selectedFields,
          sourceName: schema.data?.sourceName || '',
          sourceMode: dataSource.data?.srcType || 'unknown',
          sourcePath: dataSource.data?.srcType === 'file' ? dataSource.data?.dir || '' : ''
        };
      });

    return {
      id: dataSource.id,
      type: dataSource.data?.type || 'unknown',
      sourceType: dataSource.data?.srcType || 'unknown',
      schemas: connectedSchemas,
      connection: dataSource.data?.connectionString,
      file: dataSource.data?.file,
      sourcePath: dataSource.data?.dir || ''
    };
  });

  // Safely get the load node information
  const loadInfo = loadNode ? {
    id: loadNode.id,
    type: loadNode.data?.mode || 'file',
    path: loadNode.data?.dir || '',
    fileName: loadNode.data?.fileName || '',
    connection: loadNode.data?.connString || '',
    dbName: loadNode.data?.dbName || '',
    fileType: loadNode.data?.label?.toLowerCase() || '' // CSV or JSON
  } : null;

  return {
    dataSources: dataSourcesInfo,
    operations: operations,
    pipeline: fieldMappings,
    load: loadInfo,
  };
}
