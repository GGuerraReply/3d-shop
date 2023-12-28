import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'azure-function-express';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/api/hello", (req, res) => {
  res.status(200).send("Hello from DALL-E");
});

export default createHandler(app);