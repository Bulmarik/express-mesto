const Card = require('../models/card');
const { Forbidden } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     return res.status(400).send({ message: 'Переданы некорректные данные' });
    //   }
      next(err);
    });
};

const deleteCard = (req, res) => {
  const id = req.params._id;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFound('Данная карточка не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      return Card.findByIdAndRemove(card._id)
        .then(() => res.status(200).send({ message: 'Удаление прошло удачно' }))
        .catch((err) => {
          // if (err.name === 'CastError') {
          //   return res.status(400).send({ message: 'Переданы некорректные данные' });
          // }
          next(err);
        });
    })
    .catch(next);
};

const likeCard = (req, res) => {
  const id = req.params._id;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFound('Данная карточка не найдена');
      }
      return res.status(200).send(like);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: 'Переданы некорректные данные' });
      // }
      next(err);
    });
};

const dislikeCard = (req, res) => {
  const id = req.params._id;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFound('Данная карточка не найдена');
      }
      return res.status(200).send(like);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: 'Переданы некорректные данные' });
      // }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
