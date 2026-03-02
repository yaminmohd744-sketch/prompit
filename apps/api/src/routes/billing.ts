import type { FastifyInstance } from "fastify";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.js";
import { db } from "@prompit/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

const PLANS = {
  PRO: { priceId: process.env.STRIPE_PRO_PRICE_ID ?? "", credits: 2000 },
  TEAM: { priceId: process.env.STRIPE_TEAM_PRICE_ID ?? "", credits: 5000 },
};

export async function billingRoutes(app: FastifyInstance) {
  app.get("/plans", async () => ({
    plans: [
      { id: "FREE", name: "Free", price: 0, credits: 100 },
      { id: "PRO", name: "Pro", price: 29, credits: 2000 },
      { id: "TEAM", name: "Team", price: 99, credits: 5000 },
    ],
  }));

  app.post("/checkout", { preHandler: requireAuth }, async (req, reply) => {
    const payload = req.user as { userId: string };
    const { planId } = req.body as { planId: keyof typeof PLANS };

    const plan = PLANS[planId];
    if (!plan) return reply.status(400).send({ error: "Invalid plan" });

    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) return reply.status(404).send({ error: "User not found" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/settings/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/settings/billing?canceled=1`,
      metadata: { userId: payload.userId, planId },
    });

    return { url: session.url };
  });

  app.post("/webhook", async (req, reply) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody as string,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
    } catch {
      return reply.status(400).send({ error: "Invalid signature" });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as keyof typeof PLANS;
        if (userId && planId) {
          const plan = PLANS[planId];
          await db.user.update({
            where: { id: userId },
            data: {
              plan: planId,
              credits: { increment: plan.credits },
              stripeCustomerId: session.customer as string,
            },
          });
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: "FREE" },
        });
        break;
      }
    }

    return { received: true };
  });
}
