import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'azure-function-express';
import imageProcessor from '../common/imageProcessor.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/file", async (req, res) => {
  try {
    const { image, type } = req.body;
    
    let resultImage = await imageProcessor(image, type);

    res.status(200).json({ photo: resultImage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "ERROR: " + error.message });
  }
});

export default createHandler(app);