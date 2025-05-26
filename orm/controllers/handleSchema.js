import { integrateSchemas } from '../utils/integrateSchemas.js';

export const handleSelectedSchema = async (req, res) => {
  const selectedSchemas = req.body.data;
  const integratedSchema = integrateSchemas(selectedSchemas);
  return res.json(integratedSchema );


};
