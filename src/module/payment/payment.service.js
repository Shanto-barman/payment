const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../product/product.model")
const Payment = require('./payment.model')



const createCheckoutSession = async({userId, productIds, quantity}) => {
    const product = await Product.findById(productIds);
    const productPrice = product.price * quantity;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: product.name },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: quantity,
            },
        ],
        metadata: {
            userId,
            productIds: JSON.stringify(productIds),
        },
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    await Payment.create({
        userId,
        productIds,
        amount: productPrice,
        currency: "usd",
        status: "pending",
        paymentIntentId: session.id,
    });

    return session.url;
};


//update status on webhook event
const updatePaymentStatus = async (paymentIntentId, status) => {

  console.log(paymentIntentId, status)

  return Payment.findOneAndUpdate(
    { paymentIntentId },
    { status },
    { new: true }
  );
};

// Verify Webhook Signature
const verifyWebhookSignature = (rawBody, signature) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

module.exports = {
    createCheckoutSession, updatePaymentStatus, verifyWebhookSignature,
};



