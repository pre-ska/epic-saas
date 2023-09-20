import getRawBody from "raw-body";
import { stripe } from "src/pricing/utils/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;

  let event;

  try {
    const rawBody = await getRawBody(req, { limit: "2mb" });
    event = stripe.webhooks.constructEvent(rawBody, signature, signingSecret);
  } catch (error) {
    console.log("Webhook signature verification failed");
    return res.status(400).end();
  }

  console.log("EVENT WEBHOOK", event);

  res.send({ success: true });
}
