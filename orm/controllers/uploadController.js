import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import mime from 'mime-types';
import { fileTypeFromFile } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(file.path);
  const fileType = await fileTypeFromFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mime.lookup(filePath);

  if (
    (fileType && fileType.mime !== 'text/csv') &&
    ext !== '.csv' &&
    mimeType !== 'text/csv'
  ) {
    return res.status(400).json({ error: 'Uploaded file is not a CSV file' });
  }

  // Parse CSV inside a Promise so we can await
  try {
    const results = await new Promise((resolve, reject) => {
      const dataRows = [];

      fs.createReadStream(filePath, { encoding: 'utf8' })
        .pipe(csv({ separator: ',' }))
        .on('data', (data) => dataRows.push(data))
        .on('end', () => resolve(dataRows))
        .on('error', (err) => reject(err));
    });



    return res.status(201).json({
      message: 'File uploaded and parsed successfully',
      originalName: path.basename(filePath),
      content: results,
    });
  } catch (err) {
    console.error('CSV Parsing Error:', err);
    return res.status(500).json({ error: 'Failed to parse CSV file' });
  }
};
