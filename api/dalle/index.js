import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'azure-function-express';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import imageProcessor from '../common/imageProcessor.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// You will need to set these environment variables or edit the following values
const endpoint = process.env.OPENAI_API_BASE;
const azureApiKey = process.env.OPENAI_API_KEY;

app.post("/api/dalle", async (req, res) => {
  try {
    const { prompt, type } = req.body;
    let fullprompt = prompt;

    if(type === 'logo') {
      fullprompt += '. The image has to be a stylized logo in fabric style';
    } else if(type === 'full') {
      fullprompt += '. The image has to have only one subject and must have a fabric texture';
    }

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = "dall-e";
    const n = 1;
    const size = '1024x1024';
    const responseFormat = "b64_json"

    const result = await client.getImages(deploymentName, fullprompt, { n, size, responseFormat });
    let resultImage = await imageProcessor(result.data[0].base64Data, type);

    res.status(200).json({ photo: resultImage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "ERROR: " + error.message });
  }
});

export default createHandler(app);