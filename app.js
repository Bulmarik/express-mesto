const express = require('express');
const {PORT = 3000} = process.env;
const mongoose = require('mongoose');
const router = require('./routes/index');
const app  = express();


mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '606b587d4391ba0aec2379b9'
  };
  next();
});
app.use(router);
app.listen(PORT);