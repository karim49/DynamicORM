import etl from 'etl';
import { extractFromSource } from '../etl/extract.js';
import { transformData } from '../etl/transform.js';
import { loadToTarget } from '../etl/load.js';

// Helper to apply pipeline transforms
async function applyPipeline(records, pipeline) {
  // If no pipeline, return records as-is
  if (!pipeline || !Array.isArray(pipeline) || pipeline.length === 0) return records;

  // Build a map for quick lookup
  const fieldMap = {};
  for (const step of pipeline) {
    fieldMap[step.field] = step;
  }

  
  // Use etljs to process each record according to pipeline
  return new Promise((resolve, reject) => {
    const out = [];
    etl.toStream(records)
      .pipe(etl.map(record => {
        const newRecord = { ...record };
        for (const field in fieldMap) {
          const step = fieldMap[field];
          if (step.viaTransform && step.transform && step.transform.function === 'Replace') {
            // Example: Replace function
            const params = step.transform.params || {};
            if (typeof newRecord[field] === 'string' && params.search && params.replace !== undefined) {
              newRecord[field] = newRecord[field].replaceAll(params.search, params.replace);
            }
          }
        }
        return newRecord;
      }))
      .pipe(etl.collect(10000))
      .on('data', data => out.push(...data))
      .on('end', () => resolve(out))
      .on('error', reject);
  });
}

async function runETL(req, res) {
  try {
    const { dataSource, pipeline, load } = req.body;
    if (!dataSource || !load) {
      return res.status(400).json({ error: 'Missing dataSource or load configuration.' });
    }
    // Extract
    const extracted = await extractFromSource(dataSource);
    // Transform (pipeline)
    const transformed = await applyPipeline(extracted, pipeline);
    // Load
    const result = await loadToTarget(transformed, load);
    res.json({ message: 'ETL completed', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { runETL };
