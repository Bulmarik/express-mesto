const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '606c5abff893571b309837e1',
  };
  next();
});
app.use(router);
app.listen(PORT);
