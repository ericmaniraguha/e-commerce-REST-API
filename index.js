const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Database connection successfull....!'))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);

app.listen(PORT || 5000, () => {
  console.log(`The backend server is running on : ....${PORT}`);
});
