const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = require('./app');
const { connectMongoDB } = require('./database/db');

app.use(express.static('public'));

connectMongoDB().then(() => {
  console.log('DB connected 🚀');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
