import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createAzureFunctionHandler } from 'azure-function-express';

dotenv.config({ path: '.env' });

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from DALL-E");
});

app.use('/api', router);

export default createAzureFunctionHandler(app);