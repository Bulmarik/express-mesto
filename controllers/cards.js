const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({message: "Произошла ошибка"}));
};

const createCard = (req, res) => {
  const {name, link, owner} = req.body;
  Card.create({name, link, user})
  .then((card) => res.send(card))
  .catch((err) => res.status(500).send({message: "Произошла ошибка"}));
};

const deleteCard = (req, res) => {
  const {id} = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({message: "Произошла ошибка"}));
}

const likeCard = (req, res) => {
  const {id} = req.params;
  Card.findByIdAndUpdate(
    id,
    {$addToSet: {likes: req.user._id}},
    {new: true},
  )
    .then((like) => res.send(like))
    .catch((err) => res.status(500).send({message: "Произошла ошибка"}));
};

const dislikeCard = (req, res) => {
  const {id} = req.params;
  Card.findByIdAndUpdate(
    id,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
    .then((like) => res.send(like))
    .catch((err) => res.status(500).send({message: "Произошла ошибка"}));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}