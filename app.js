const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const router = require('./routes/index');
const {
  createUser, login,
} = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '60702489627fe916f40a20ce',
//   };
//   next();
// });
app.post('/signin', login);
app.post('/signup', createUser);
app.use(router);
app.listen(PORT);
