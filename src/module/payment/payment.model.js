const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productIds:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
        type: String,
        enum: ["pending", "succeeded", "failed"],
        default: "pending"
  },
  paymentIntentId:{type:String}
},{timeStamps:true});

module.exports = mongoose.model("Payment", paymentSchema);