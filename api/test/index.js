const express = require('express');
const { createAzureFunctionHandler } = require('azure-function-express');

const app = express();

app.get('/test', (req, res) => {
  res.json({
    text: "Hello from the API"
  });
});

module.exports = createAzureFunctionHandler(app);