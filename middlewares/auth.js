const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/errors');

const JWT_SECRET = 'process.env.JWT_SECRET';

/// ////
function getCookie(req) {
  const { cookie } = req.headers;
  if (cookie) {
    const value = cookie.split(';').reduce((res, item) => {
      const data = item.trim().split('=');
      return { ...res, [data[0]]: data[1] };
    }, {});
    return value;
  }
  return undefined;
}

const auth = (req, res, next) => {
  const cookies = getCookie(req);
  if (!cookies) {
    throw new Unauthorized('Ошибка авторизации');
  }
  const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Unauthorized('Ошибка авторизации');
  }

  req.user = payload;
  next();
};
/// /////

// const auth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   let payload;
//   try {
//     payload = jwt.verify(token, JWT_SECRET)
//   } catch {
//     throw new Unauthorized('Ошибка авторизации');
//   }

//   req.user = payload;
//   next();
// }

module.exports = auth;
