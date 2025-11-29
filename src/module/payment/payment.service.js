const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../product/product.model")
const Payment = require('./payment.model')

exports.createCheckoutSession = async ({ userId, productIds, quantity }) => {
  if (!userId) throw new Error("UserId is required");

  const product = await Product.findById(productIds);
  if (!product) throw new Error("Product not found");

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
        userId: userId.toString(),       
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

// Update payment status on webhook
exports.updatePaymentStatus = async (paymentIntentId, status) => {
  return Payment.findOneAndUpdate(
    { paymentIntentId },
    { status },
    { new: true }
  );
};

// Verify Stripe webhook signature
exports.verifyWebhookSignature = (rawBody, signature) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

