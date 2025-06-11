import etl from 'etl';
import { extractFromSource } from '../etl/extract.js';
import { loadToTarget } from '../etl/load.js';
import path from 'path';

// Helper to perform join operations
async function performJoinOperations(records, operations) {
  if (!operations || !Array.isArray(operations) || operations.length === 0) return records;

  // Group records by schema
  const recordsBySchema = records.reduce((acc, record) => {
    const schemaId = record.__schemaId;
    if (!acc[schemaId]) acc[schemaId] = [];
    acc[schemaId].push(record);
    return acc;
  }, {});

  let joinedRecords = [...records];

  for (const operation of operations) {
    const leftRecords = recordsBySchema[operation.leftSchema] || [];
    const rightRecords = recordsBySchema[operation.rightSchema] || [];
    
    // Create indexes for faster joining
    const rightIndex = new Map();
    rightRecords.forEach(rightRecord => {
      const key = rightRecord[operation.rightField];
      if (!rightIndex.has(key)) {
        rightIndex.set(key, []);
      }
      rightIndex.get(key).push(rightRecord);
    });

    // Track matched right records for full/right joins
    const matchedRightRecords = new Set();
    
    switch (operation.type.toLowerCase()) {
      case 'inner': {
        // Perform inner join
        const joinedData = [];
        leftRecords.forEach(leftRecord => {
          const key = leftRecord[operation.leftField];
          const matchingRightRecords = rightIndex.get(key) || [];
          
          matchingRightRecords.forEach(rightRecord => {
            matchedRightRecords.add(rightRecord);
            joinedData.push({
              ...leftRecord,
              ...rightRecord,
              __sourceId: `${leftRecord.__sourceId}_${rightRecord.__sourceId}`,
              __schemaId: `${leftRecord.__schemaId}_${rightRecord.__schemaId}`,
              __joinId: operation.id
            });
          });
        });
        joinedRecords = joinedData;
        break;
      }
      
      case 'left': {
        // Perform left outer join
        const joinedData = [];
        leftRecords.forEach(leftRecord => {
          const key = leftRecord[operation.leftField];
          const matchingRightRecords = rightIndex.get(key) || [];
          
          if (matchingRightRecords.length === 0) {
            // No match - include left record with nulls for right side
            const nullRightRecord = {};
            rightRecords[0] && Object.keys(rightRecords[0]).forEach(key => {
              if (key !== operation.rightField && !key.startsWith('__')) {
                nullRightRecord[key] = null;
              }
            });
            
            joinedData.push({
              ...leftRecord,
              ...nullRightRecord,
              __sourceId: `${leftRecord.__sourceId}_null`,
              __schemaId: `${leftRecord.__schemaId}_null`,
              __joinId: operation.id
            });
          } else {
            // Has matches - include all combinations
            matchingRightRecords.forEach(rightRecord => {
              matchedRightRecords.add(rightRecord);
              joinedData.push({
                ...leftRecord,
                ...rightRecord,
                __sourceId: `${leftRecord.__sourceId}_${rightRecord.__sourceId}`,
                __schemaId: `${leftRecord.__schemaId}_${rightRecord.__schemaId}`,
                __joinId: operation.id
              });
            });
          }
        });
        joinedRecords = joinedData;
        break;
      }
      
      case 'right': {
        // Perform right outer join
        const joinedData = [];
        rightRecords.forEach(rightRecord => {
          const key = rightRecord[operation.rightField];
          const matchingLeftRecords = leftRecords.filter(
            left => left[operation.leftField] === key
          );
          
          if (matchingLeftRecords.length === 0) {
            // No match - include right record with nulls for left side
            const nullLeftRecord = {};
            leftRecords[0] && Object.keys(leftRecords[0]).forEach(key => {
              if (key !== operation.leftField && !key.startsWith('__')) {
                nullLeftRecord[key] = null;
              }
            });
            
            joinedData.push({
              ...nullLeftRecord,
              ...rightRecord,
              __sourceId: `null_${rightRecord.__sourceId}`,
              __schemaId: `null_${rightRecord.__schemaId}`,
              __joinId: operation.id
            });
          } else {
            // Has matches - include all combinations
            matchingLeftRecords.forEach(leftRecord => {
              joinedData.push({
                ...leftRecord,
                ...rightRecord,
                __sourceId: `${leftRecord.__sourceId}_${rightRecord.__sourceId}`,
                __schemaId: `${leftRecord.__schemaId}_${rightRecord.__schemaId}`,
                __joinId: operation.id
              });
            });
          }
        });
        joinedRecords = joinedData;
        break;
      }
      
      case 'full': {
        // Perform full outer join (combination of left and right joins)
        const joinedData = [];
        
        // First, do left join part
        leftRecords.forEach(leftRecord => {
          const key = leftRecord[operation.leftField];
          const matchingRightRecords = rightIndex.get(key) || [];
          
          if (matchingRightRecords.length === 0) {
            // No match - include left record with nulls for right side
            const nullRightRecord = {};
            rightRecords[0] && Object.keys(rightRecords[0]).forEach(key => {
              if (key !== operation.rightField && !key.startsWith('__')) {
                nullRightRecord[key] = null;
              }
            });
            
            joinedData.push({
              ...leftRecord,
              ...nullRightRecord,
              __sourceId: `${leftRecord.__sourceId}_null`,
              __schemaId: `${leftRecord.__schemaId}_null`,
              __joinId: operation.id
            });
          } else {
            // Has matches - include all combinations
            matchingRightRecords.forEach(rightRecord => {
              matchedRightRecords.add(rightRecord);
              joinedData.push({
                ...leftRecord,
                ...rightRecord,
                __sourceId: `${leftRecord.__sourceId}_${rightRecord.__sourceId}`,
                __schemaId: `${leftRecord.__schemaId}_${rightRecord.__schemaId}`,
                __joinId: operation.id
              });
            });
          }
        });
        
        // Then add unmatched right records
        rightRecords.forEach(rightRecord => {
          if (!matchedRightRecords.has(rightRecord)) {
            const nullLeftRecord = {};
            leftRecords[0] && Object.keys(leftRecords[0]).forEach(key => {
              if (key !== operation.leftField && !key.startsWith('__')) {
                nullLeftRecord[key] = null;
              }
            });
            
            joinedData.push({
              ...nullLeftRecord,
              ...rightRecord,
              __sourceId: `null_${rightRecord.__sourceId}`,
              __schemaId: `null_${rightRecord.__schemaId}`,
              __joinId: operation.id
            });
          }
        });
        
        joinedRecords = joinedData;
        break;
      }
      
      case 'union': {
        // Perform union of both sets
        const unionData = new Map();
        
        // Process left records
        leftRecords.forEach(leftRecord => {
          const key = leftRecord[operation.leftField];
          if (!unionData.has(key)) {
            unionData.set(key, {
              ...leftRecord,
              __sourceId: leftRecord.__sourceId,
              __schemaId: leftRecord.__schemaId,
              __joinId: operation.id
            });
          }
        });
        
        // Process right records
        rightRecords.forEach(rightRecord => {
          const key = rightRecord[operation.rightField];
          if (!unionData.has(key)) {
            unionData.set(key, {
              ...rightRecord,
              __sourceId: rightRecord.__sourceId,
              __schemaId: rightRecord.__schemaId,
              __joinId: operation.id
            });
          }
        });
        
        joinedRecords = Array.from(unionData.values());
        break;
      }
    }
  }

  return joinedRecords;
}

// Helper to apply pipeline transforms
async function applyPipeline(records, pipeline) {
  if (!pipeline || !Array.isArray(pipeline) || pipeline.length === 0) return records;

  // Group records by schema or joined schema
  const recordsBySchema = records.reduce((acc, record) => {
    const schemaId = record.__schemaId;
    if (!acc[schemaId]) acc[schemaId] = [];
    acc[schemaId].push(record);
    return acc;
  }, {});

  // Process each schema's records separately
  const processedRecords = [];
  for (const schemaId in recordsBySchema) {
    const schemaRecords = recordsBySchema[schemaId];
    const schemaPipeline = pipeline.filter(step => {
      // Handle both regular and joined schemas
      if (schemaId.includes('_')) {
        // For joined records, match if either schema matches
        const [leftSchemaId, rightSchemaId] = schemaId.split('_');
        return step.schemaId === leftSchemaId || step.schemaId === rightSchemaId;
      }
      return step.schemaId === schemaId;
    });
    
    // Process the records through ETL stream
    const processed = await new Promise((resolve, reject) => {
      const out = [];
      etl.toStream(schemaRecords)
        .pipe(etl.map(record => {
          const newRecord = { 
            __sourceId: record.__sourceId,
            __schemaId: record.__schemaId
          };
          
          // Only process fields that are in the pipeline
          for (const step of schemaPipeline) {
            const { field, transform, operation } = step;
            
            // Skip if field is not in the original record
            if (record[field] === undefined) continue;
            
            // Initialize the field with original value if not already set
            if (newRecord[field] === undefined) {
              newRecord[field] = record[field];
            }
            
            if (step.viaTransform && transform) {
              switch (transform.function) {
                case 'Replace':
                  if (typeof newRecord[field] === 'string' && transform.params.searchFor) {
                    newRecord[field] = newRecord[field].replaceAll(
                      transform.params.searchFor,
                      transform.params.replaceWith || ''
                    );
                  }
                  break;
                  
                case 'Filter':
                  if (transform.params.operator === '==' && 
                      transform.params.value !== undefined) {
                    if (newRecord[field] !== transform.params.value) {
                      return null; // Skip this record
                    }
                  }
                  break;
              }
            }
          }
          return newRecord;
        }))
        .pipe(etl.map(record => record)) // Remove null records from filtering
        .pipe(etl.collect(10000))
        .on('data', data => out.push(...data.filter(Boolean)))
        .on('end', () => resolve(out))
        .on('error', reject);
    });
    
    processedRecords.push(...processed);
  }

  return processedRecords;
}

async function runETL(req, res) {
  try {
    const { dataSources, operations, pipeline, load } = req.body;
    
    if (!dataSources || !load) {
      return res.status(400).json({ error: 'Missing dataSources or load configuration.' });
    }

    // Extract
    const extracted = await extractFromSource({ dataSources });
    
    // Perform join operations if any
    const joined = await performJoinOperations(extracted, operations);
    
    // Transform (pipeline)
    const transformed = await applyPipeline(joined, pipeline);
    
    // Prepare load config
    const loadConfig = {
      type: load.type,
      fileType: load.fileType,
      filePath: load.path ? path.join(load.path, load.fileName) : path.join(process.cwd(), 'data', `output.${load.fileType || 'json'}`)
    };
    
    // Load
    const result = await loadToTarget(transformed, loadConfig);
    
    res.json({ 
      message: 'ETL completed', 
      result,
      recordsProcessed: transformed.length 
    });
    
  } catch (err) {
    console.error('ETL Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export { runETL };
