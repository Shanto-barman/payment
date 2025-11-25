const dotenv = require('dotenv')
dotenv.config()

const express =require('express')
const appRouters = require('./app')
const connectDB =require('./src/config/db')
const { PORT } = require('./src/config/envConfig')
const path = require('path')
const paymentRoutes = require('./src/module/payment/payment.route')


const app = express();

app.use(express.json());
connectDB();

app.use('/api/pay', paymentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', appRouters);

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))

