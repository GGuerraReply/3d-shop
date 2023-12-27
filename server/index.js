import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limig: "50mb" }));

app.get("/", (req, res) => {
  res.status(200).send("Hello from DALL-E");
});

app.listen(8080, () => console.log(`Server is listening on port ${process.env.PORT}`));