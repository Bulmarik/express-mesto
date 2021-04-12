const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const router = require('./routes/index');
const {validLogin, validCreateUser} = require('./validator/validator');
const { errors } = require('celebrate');
const {
  createUser, login,
} = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '60702489627fe916f40a20ce',
//   };
//   next();
// });
app.post('/signin', validLogin, login);
app.post('/signup', validCreateUser, createUser);
app.use(router);
app.use(errors());
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;

//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'На сервере произошла ошибка'
//         : message
//     });
// });

app.listen(PORT);
