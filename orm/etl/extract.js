import etl from 'etl';
import fs from 'fs';
import path from 'path';

// Extract data from multiple sources and combine them
async function extractFromSource(dataSourceConfig) {
  const results = [];
  
  for (const source of dataSourceConfig.dataSources) {
    if (source.type === 'csv') {
      for (const schema of source.schemas) {
        const filePath = path.join(process.cwd(), 'data', schema.sourceName);
        try {
          const schemaData = await new Promise((resolve, reject) => {
            const fileResults = [];
            fs.createReadStream(filePath)
              .pipe(etl.csv())
              .pipe(etl.map(record => {
                // Create a new record with only selected fields
                const filteredRecord = {};
                for (const field of schema.selectedFields) {
                  if (record[field] !== undefined) {
                    filteredRecord[field] = record[field];
                  }
                }
                return {
                  ...filteredRecord,
                  __sourceId: source.id,
                  __schemaId: schema.id
                };
              }))
              .pipe(etl.collect(10000))
              .on('data', data => fileResults.push(...data))
              .on('end', () => resolve(fileResults))
              .on('error', reject);
          });
          results.push(...schemaData);
        } catch (err) {
          console.error(`Error reading file ${schema.sourceName}:`, err);
          throw new Error(`Failed to read file ${schema.sourceName}`);
        }
      }
    }
  }
  
  return results;
}

export { extractFromSource };
