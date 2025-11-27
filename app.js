const express = require('express')
const router = express.Router()
const paymentRouters = require('./src/module/payment/payment.route');
const productRouters = require('./src/module/product/product.route');
const userRouters = require('./src/module/user/user.route')

router.use("/auth", userRouters);
router.use('/payment', paymentRouters);
router.use('/product', productRouters);



module.exports = router;     

