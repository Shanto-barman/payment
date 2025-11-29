const express = require('express')
const router = express.Router();
const paymentController = require('./payment.controller');
const { checkUserToken } = require('../../middleware/authMiddleware');

router.post('/checkout',checkUserToken, paymentController.createCheckout);

//Stripe webhook must use row body
router.post(
    '/webhook', 
    express.raw({type:'application/json'}),
paymentController.handleWebhook
);

module.exports = router;



