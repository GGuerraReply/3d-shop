import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createAzureFunctionHandler } from 'azure-function-express';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from DALL-E");
});

app.use('/api', router);
app.listen(80, () => console.log(`Server is listening on port 80`));

export default createAzureFunctionHandler(app);