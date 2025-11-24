const mongoos = require('mongoos');

const paymentSchema = new mongoos.Schema({
    userId:{
        type:mongoos.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productIds:[
        {type:mongoos.Schema.Types.ObjectId,
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

module.exports = mongoos.model("Payment", paymentSchema);