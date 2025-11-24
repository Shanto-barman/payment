const { error } = require('console');
const { createCheckoutSession, updatePaymentStatus, verifyWebhookSignature } = require('./payment.service');


exports.createCheckout = async (req, res) => {
  try {
    const { quantity, productIds } = req.body;

    const url = await createCheckoutSession({
      userId: req.user.userId,
      quantity,
      productIds,
    });

    res.status(200).json({ checkoutUrl: url });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.handleWebhook = async (req, res) => {

  console.log("webhook working");

  try {
    const signature = req.headers["stripe-signature"];
    const event = verifyWebhookSignature(req.body, signature);

    const data = event.data.object;

    if (event.type === "checkout.session.completed") {
      await updatePaymentStatus(data.id, "succeeded");
    }
    if (event.type === "checkout.session.async_payment_failed") {
      await updatePaymentStatus(data.id, "failed");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};