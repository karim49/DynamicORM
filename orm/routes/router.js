import express from 'express';
import multer from 'multer';
import { handleConnection } from '../controllers/connectionController.js';
import { handleFileUpload } from '../controllers/uploadController.js';
import { handleSelectedSchema} from '../controllers/handleSchema.js';
import { runETL } from '../controllers/etlController.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.join(__dirname, '..', 'uploads');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original name of the uploaded file
  }
});

const upload = multer({ storage: storage });


router.post('/connection', handleConnection);
router.post('/uploadFile', upload.single('file'), handleFileUpload);
router.post('/handleSelectedSchema', handleSelectedSchema);
router.post('/etl/configuration', runETL);

export default router;
