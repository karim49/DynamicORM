import etl from 'etl';
import fs from 'fs';

// Extract data from a CSV file using etljs
async function extractFromSource(sourceConfig) {
  if (sourceConfig.type === 'csv' && sourceConfig.filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(sourceConfig.filePath)
        .pipe(etl.csv())
        .pipe(etl.collect(10000))
        .on('data', data => results.push(...data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
  return [];
}

export { extractFromSource };
