
const express = require('express');
const router = express.Router();
const { createUser,getUsers, loginUser ,getMe,showUser, refreshTokenUser, forgetPassController, verifyOTPController, resetPasswordController} = require('./user.controller');
const { checkUserToken, checkAdminToken } = require('../../middleware/authMiddleware');

router.post('/register',createUser);

router.post('/login',loginUser);

router.post('/forget-pass',forgetPassController);

router.post('/verify-otp',verifyOTPController);

router.post('/reset-password',resetPasswordController);

router.post('/refresh-token', refreshTokenUser);

router.get('/get-users',checkAdminToken, getUsers);

router.get('/me', checkUserToken, getMe);

router.get('/:id', showUser);


module.exports = router;