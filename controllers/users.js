const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка'}));
};

const getUserById = (req, res) => {
  const {id} = req.params;
  User.findById(id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

const patchUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

const patchAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Данный пользователь не найден' });
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUser,
  patchAvatar
}