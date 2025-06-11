import etl from 'etl';
import fs from 'fs';
import path from 'path';

// Helper to convert records to CSV string
function recordsToCSV(records) {
  if (records.length === 0) return '';
  
  // Get all unique columns (excluding internal fields)
  const columns = new Set();
  records.forEach(record => {
    Object.keys(record).forEach(key => {
      if (!key.startsWith('__')) {
        columns.add(key);
      }
    });
  });
  
  const headerRow = Array.from(columns).join(',');
  
  // Convert each record to CSV row
  const rows = records.map(record => {
    return Array.from(columns).map(col => {
      const value = record[col] ?? '';
      // Escape values containing commas or quotes
      return value.toString().includes(',') || value.toString().includes('"') 
        ? `"${value.toString().replace(/"/g, '""')}"` 
        : value;
    }).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

// Load data to a target (file or other destinations)
async function loadToTarget(records, targetConfig) {
  // Default to JSON file if no specific type is provided
  const type = targetConfig.type || 'file';
  
  switch (type) {
    case 'file': {
      const fileType = (targetConfig.fileType || 'json').toLowerCase();
      const filePath = targetConfig.filePath || path.join(process.cwd(), 'data', `output.${fileType}`);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Filter out internal tracking fields
      const cleanRecords = records.map(record => {
        const cleanRecord = {};
        for (const key in record) {
          if (!key.startsWith('__')) {
            cleanRecord[key] = record[key];
          }
        }
        return cleanRecord;
      });

      if (fileType === 'csv') {
        // Write CSV directly
        const csvContent = recordsToCSV(cleanRecords);
        await fs.promises.writeFile(filePath, csvContent);
        return {
          success: true,
          count: records.length,
          filePath,
          format: 'csv'
        };
      } else {
        // JSON output
        return new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(filePath);
          etl.toStream(cleanRecords)
            .pipe(etl.stringify())
            .pipe(writeStream)
            .on('finish', () => resolve({ 
              success: true, 
              count: records.length,
              filePath,
              format: 'json'
            }))
            .on('error', reject);
        });
      }
    }
      
    // Add more target types here as needed
    default:
      throw new Error(`Unsupported target type: ${type}`);
  }
}

export { loadToTarget };
