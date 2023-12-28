import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createHandler } from 'azure-function-express';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import Jimp from 'jimp';

dotenv.config();

const app = express();
app.use(cors());
//app.options('*', cors());
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
      fullprompt += '. The image has to be appliable to a T-Shirt 3D Model';
    }

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentName = "dall-e";
    const n = 1;
    const size = '1024x1024';
    const responseFormat = "b64_json"

    const result = await client.getImages(deploymentName, fullprompt, { n, size, responseFormat });

    let image = result.data[0].base64Data;

    if(type === 'logo') {
      let buffer = Buffer.from(image, 'base64');

      let processingimage = await Jimp.read(buffer);
      
      // Crea una nuova immagine trasparente con la stessa larghezza e altezza dell'immagine originale
      let mask = new Jimp(processingimage.bitmap.width, processingimage.bitmap.height);
      
      // Disegna un cerchio bianco (#FFFFFF) al centro della maschera
      const radius = Math.min(processingimage.bitmap.width, processingimage.bitmap.height) / 2;
      const centerX = processingimage.bitmap.width / 2;
      const centerY = processingimage.bitmap.height / 2;
      for (let x = 0; x < mask.bitmap.width; x++) {
        for (let y = 0; y < mask.bitmap.height; y++) {
          const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (distanceFromCenter <= radius) {
            mask.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 255), x, y);
          }
        }
      }
      
      // Applica la maschera all'immagine originale
      processingimage.mask(mask, 0, 0);
      
      // Converte l'immagine modificata in un buffer PNG
      let pngBuffer = await processingimage.getBufferAsync(Jimp.MIME_PNG);
      
      // Converte il buffer in una stringa base64
      let base64Image = pngBuffer.toString('base64');
      
      // Ora 'base64Image' contiene l'immagine modificata come stringa base64
      image = base64Image;
    }

    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "ERROR: " + error.message });
  }
});

export default createHandler(app);