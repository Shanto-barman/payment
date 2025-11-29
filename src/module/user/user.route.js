
const express = require('express');
const router = express.Router();
const { register,getUsers, loginUser ,getMe,showUser, refreshTokenUser, forgetPassController, verifyOTPController, resetPasswordController, logoutUser} = require('./user.controller');
const { checkUserToken, checkAdminToken } = require('../../middleware/authMiddleware');

router.post('/register',register);

router.post('/login',loginUser);

router.post('/logout',logoutUser);

router.post('/forget-pass',forgetPassController);

router.post('/verify-otp',verifyOTPController);

router.post('/reset-password',resetPasswordController);

router.post('/refresh-token', refreshTokenUser);

router.get('/get-users',checkAdminToken, getUsers);

router.get('/me', checkUserToken, getMe);

router.get('/:id', showUser);

router.put('/update/:id', isAuthenticated, singleUpload, updateUser)


module.exports = router;