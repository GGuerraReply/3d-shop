import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'azure-function-express';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import AbortController from "abort-controller";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// You will need to set these environment variables or edit the following values
const endpoint = process.env.OPENAI_API_BASE;
const azureApiKey = process.env.OPENAI_API_KEY;

app.post("/api/dalle", async (req, res) => {
  try {
    const { prompt } = req.body;

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = "dall-e";
    const n = 1;
    const size = '1024x1024';
    const responseFormat = "b64_json"

    const result = await client.getImages(deploymentName, prompt, { n, size, responseFormat });

    const image = result.data[0].base64Data;

    res.status(200).json({ photo: image });
  } catch (error) {
    res.status(500).json({ error: "ERROR: " + error.message });
  }
});

export default createHandler(app);