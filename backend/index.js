import express from 'express';
import { port } from './config/index.js';
import loader from './loaders/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: '250mb' }));
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }));
// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
loader(app);

app.listen(port, err => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  console.log(`Server is running on ${port}`);
});
