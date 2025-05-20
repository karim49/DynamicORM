import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', file.path);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading uploaded file' });

    console.log('File content:', data);

    return res.status(201).json({
      message: 'File uploaded successfully',
      originalName: file.originalname,
      content: data,
    });
  });
};
