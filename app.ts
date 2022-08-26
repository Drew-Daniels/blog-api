const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('response');
});

app.listen(PORT, () => {
   console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
