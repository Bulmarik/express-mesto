const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  const id = req.params._id;
  Card.findById(id)
    .then((card) => {
      if (card.owner !== req.user._id) {
        return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }
      return Card.findByIdAndRemove(card._id)
        .orFail(new Error('NotValidId'))
        .then(() => res.status(200).send({ message: 'Удаление прошло удачно' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return res.status(400).send({ message: 'Переданы некорректные данные' });
          }
          if (err.message === 'NotValidId') {
            return res.status(404).send({ message: 'Данная карточка не найдена' });
          }
          return res.status(500).send({ message: 'Произошла ошибка сервера' });
        });
    });
};

const likeCard = (req, res) => {
  const id = req.params._id;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((like) => res.status(200).send(like))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данная карточка не найдена' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  const id = req.params._id;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((like) => res.status(200).send(like))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Данная карточка не найдена' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
