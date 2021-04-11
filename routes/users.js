const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUser, getUserById, patchUser, patchAvatar,
} = require('../controllers/users');

router.use(auth);
router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:_id', getUserById);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
