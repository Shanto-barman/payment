
const express = require('express');
const router = express.Router();
const { register, loginUser, refreshTokenUser, forgetPassController, verifyOTPController, resetPasswordController, logoutUser, updateUserController, getAllUserController} = require('./user.controller');
const { checkUserToken, checkAdminToken } = require('../../middleware/authMiddleware');

router.post('/register',register);

router.post('/login',loginUser);

router.post('/logout',logoutUser);

router.post('/forget-pass',forgetPassController);

router.post('/verify-otp',verifyOTPController);

router.post('/reset-password',resetPasswordController);

router.post('/refresh-token', refreshTokenUser);

router.get('/get-users', checkUserToken, checkAdminToken, getAllUserController);

router.put('/update/:id', checkUserToken, updateUserController)


module.exports = router;