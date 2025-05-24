import {integrateSchemas} from '../utils/integrateSchemas.js';

export const handleSelectedSchema = async (req, res) =>
{
  const selectedSchemas = req.body.data;
  const integratedSchema = integrateSchemas(selectedSchemas);

  const integratedNode = {
    id: `integrated-${Date.now()}`,
    type: 'schema',
    position: { x: 500, y: 300 }, // adjust as needed
    data: {
      sourceName: 'IntegratedSchema',
      fields: integratedSchema.fields,
      isSourceSelected: false,
    },
  };
  return res.json({ node: integratedNode });


};
