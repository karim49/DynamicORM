import { integrateSchemas } from '../utils/integrateSchemas.js';

export const handleSelectedSchema = async (req, res) => {
  const selectedSchemas = req.body.data;
  const integratedSchema = integrateSchemas(selectedSchemas);

  const paddingY = 300  ;

  const avgX = selectedSchemas.reduce((sum, node) => sum + node.position.x, 0) / selectedSchemas.length;

  const maxY = Math.max(...selectedSchemas.map(node => node.position.y));


  const integratedNode = {
    id: `integrated-${Date.now()}`,
    type: 'schema',
    position: { x: avgX, y: maxY + paddingY },
    data: {
      sourceName: 'IntegratedSchema',
      fields: integratedSchema.fields,
      isSourceSelected: false,
    },
  };
  return res.json({ node: integratedNode });


};
