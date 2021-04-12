const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest,
  NotFound,
  Conflict } = require('../errors/errors');

const JWT_SECRET = 'process.env.JWT_SECRET';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const id = req.params._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Данный пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Данный пользователь уже существует');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then(() => res.status(201).send({ name, about, avatar, email }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequest('Переданы некорректные данные');
          }
        });
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    // .orFail(new Error('NotValidId'))
    .then((user) => {
      if (!user) {
        throw new NotFound('Данный пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: 'Переданы некорректные данные' });
      // }
      // if (err.message === 'NotValidId') {
      //   return res.status(404).send({ message: 'Данный пользователь не найден' });
      // }
      next(err);
    });
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      if (!user) {
        throw new NotFound('Данный пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: 'Переданы некорректные данные' });
      // }
      // if (err.message === 'NotValidId') {
      //   return res.status(404).send({ message: 'Данный пользователь не найден' });
      // }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.cookie('jwt', token, { httpOnly: true, sameSite: true }).status(200).send(user);
        });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    // .orFail(new Error('NotValidId'))
    .then((user) => {
      if (!user) {
        throw new NotFound('Данный пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: 'Переданы некорректные данные' });
      // }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUser,
  patchAvatar,
  login,
  getUser,
};
