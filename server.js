const dotenv = require('dotenv');
const app = require('./app');
const { connectMongoDB } = require('./database/db');

dotenv.config();

connectMongoDB().then(() => {
  console.log('DB connected 🚀');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
