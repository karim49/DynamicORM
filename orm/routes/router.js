import express from 'express';
import multer from 'multer';
import { handleConnection } from '../controllers/connectionController.js';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/connection', handleConnection);
router.post('/upload-file', upload.single('file'), handleFileUpload);

export default router;
