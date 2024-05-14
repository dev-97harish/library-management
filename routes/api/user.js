const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/authMiddleware');

const user_controller = require('../../controllers/api/user_controller');
const {
  signUpUserValidation,
  loginUserValidation,
  updateUserValidation,
} = require('../../validators/user.validator');

router.post('/login', loginUserValidation, user_controller.login);
router.post('/autoLogin/:userId', user_controller.autoLogin);
router.post('/register', signUpUserValidation, user_controller.register);
router.put(
  '/update-details',
  verifyToken,
  updateUserValidation,
  user_controller.update
);
router.put('/update-image/:id', verifyToken, user_controller.uploadImage);

router.get('/users', user_controller.users);
router.delete('/delete/:userId', user_controller.delete);

module.exports = router;
