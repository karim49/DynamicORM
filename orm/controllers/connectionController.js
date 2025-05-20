export const handleConnection = (req, res) => {
  const { nodeId, type, connectionString } = req.body;

  if (!type || !connectionString) {
    return res.status(400).json({ error: 'Missing required fields: type or connectionString' });
  }

  console.log('Received connection:', { nodeId, type, connectionString });

  return res.status(200).json({
    message: 'Connection data received.',
    nodeId,
    type,
    connectionString,
  });
};
