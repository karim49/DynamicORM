import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes/router.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
