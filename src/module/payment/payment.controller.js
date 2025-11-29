const {
  createCheckoutSession,
  updatePaymentStatus,
  verifyWebhookSignature,
} = require("./payment.service");

exports.createCheckout = async (req, res) => {
  try {
    const { quantity, productIds } = req.body;

    // Ensure userId from auth middleware
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const url = await createCheckoutSession({
      userId,
      quantity,
      productIds,
    });

    res.status(200).json({ checkoutUrl: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Handle Stripe webhook
exports.handleWebhook = async (req, res) => {
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
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

