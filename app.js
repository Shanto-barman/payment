const express = require('express')
const router = express.Router()
const paymentRouter = require('./src/module/payment/payment.route')
const productRoucter =

router.use('/user', paymentRouter);



module.exports = router;