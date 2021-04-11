const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'process.env.JWT_SECRET';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const getUserById = (req, res) => {
  const id = req.params._id;
  User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(403).send({ message: 'Данный пользователь уже существует' });
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then(() => res.status(201).send({ message: 'Создание учетной записи удачно' }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send({ message: 'Переданы некорректные данные' });
          }
          return res.status(500).send({ message: 'Произошла ошибка сервера' });
        });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const login = (req, res) => {
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

const getUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
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
