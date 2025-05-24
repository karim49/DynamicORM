
function integrateSchemas(schemas) {
  const combinedFields = [];

  for (const node of schemas) {
    if (node.data?.fields?.length) {
      for (const field of node.data.fields) {
        combinedFields.push({ ...field, source: node.data.sourceName });
      }
    }
  }
  return { fields: combinedFields };
}

export {integrateSchemas};
