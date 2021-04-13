const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new Unauthorized('Ошибка авторизации');
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Ошибка авторизации');
  }

  req.user = payload;
  next();
};

module.exports = auth;
