const express =require('express')
const dotenv = require('dotenv')
const appRouters = require('./app')
const connectDB =require('./src/config/db')
const connectDB =require('./src/config/envConfig')
const {PORT} = require('./src/config/envConfig')
const path = require('path')
const paymentRoutes = require('./src/module/payment/payment.route')

dotenv.config()
const app = express();

app.use('/api/pay', paymentRoutes);

app.use(express.json());
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('./api', appRouters);

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))