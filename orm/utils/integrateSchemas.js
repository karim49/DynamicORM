function integrateSchemas(nodes) {
  const combinedFields = [];

  for (const node of nodes) {
    if (node.schema?.length) {
      for (const field of node.schema) {
        combinedFields.push({ field, source: node.sourceName });
      }
    }
  }
const parents = nodes.map(node => node.nodeId);
const roots = nodes.map(node => node.parentId);

  return { combinedFields, parents ,roots };
}


export {integrateSchemas};
