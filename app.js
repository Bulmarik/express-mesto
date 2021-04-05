const express = require('express');
const {PORT = 3000} = process.env;
const mongoose = require('mongoose');
// const path = require('path');
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
    _id: '606b587d4391ba0aec2379b9' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(router);

app.listen(PORT);


// // const bodyParser = require('body-parser');
// const path = require('path');

// mongoose.connect('mongodb://localhost:27017/animals2', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });

// const app  = express();

// // app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(router);

// app.listen(PORT, () => {
//   console.log("Let's Go");
// })
