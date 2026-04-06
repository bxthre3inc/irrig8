# RAIN Stripe Integration Setup

## Overview
This document outlines the steps to integrate Stripe for RAIN's subscription billing.

---

## Prerequisites

- Stripe account (test mode for development)
- Zo Space webhook endpoint configured
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` stored in [Settings > Advanced](/?t=settings&s=advanced)

---

## Step 1: Create Stripe Products

### Product Configuration

Create the following products in Stripe Dashboard (or via API):

#### 1. Monthly Plan
```json
{
  "name": "RAIN Monthly",
  "description": "Monthly rainfall forecasts and alerts",
  "metadata": {
    "tier_id": "monthly",
    "update_frequency": "monthly",
    "regions_allowed": "1"
  }
}
```

#### 2. Weekly Plan
```json
{
  "name": "RAIN Weekly",
  "description": "Weekly rainfall forecasts with priority alerts",
  "metadata": {
    "tier_id": "weekly",
    "update_frequency": "weekly",
    "regions_allowed": "3"
  }
}
```

#### 3. Daily Plan
```json
{
  "name": "RAIN Daily",
  "description": "Daily rainfall updates with real-time alerts and API access",
  "metadata": {
    "tier_id": "daily",
    "update_frequency": "daily",
    "regions_allowed": "unlimited"
  }
}
```

#### 4. Quarterly Plan
```json
{
  "name": "RAIN Quarterly",
  "description": "Quarterly comprehensive rainfall reports",
  "metadata": {
    "tier_id": "quarterly",
    "update_frequency": "quarterly",
    "regions_allowed": "1"
  }
}
```

#### 5. 2x Results Upgrade (Add-on)
```json
{
  "name": "RAIN 2x Results Upgrade",
  "description": "Double accuracy, faster alerts, extended historical data",
  "metadata": {
    "tier_id": "upgrade_2x",
    "type": "addon"
  }
}
```

---

## Step 2: Create Prices for Each Product

### Monthly Plan Pricing
```json
{
  "product": "prod_monthly_xxx",
  "unit_amount": 1499,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "trial_period_days": 7
  }
}
```

### Weekly Plan Pricing
```json
{
  "product": "prod_weekly_xxx",
  "unit_amount": 1999,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "trial_period_days": 7
  }
}
```

### Daily Plan Pricing
```json
{
  "product": "prod_daily_xxx",
  "unit_amount": 2999,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "trial_period_days": 7
  }
}
```

### Quarterly Plan Pricing
```json
{
  "product": "prod_quarterly_xxx",
  "unit_amount": 999,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "interval_count": 3
  }
}
```

### 2x Upgrade Pricing (30% of base tier)
Create as a separate recurring add-on:
```json
{
  "product": "prod_upgrade_2x_xxx",
  "unit_amount": 0,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "usage_type": "licensed"
  }
}
```

**Note:** The 2x upgrade will be calculated as 30% of the base tier and added to the subscription.

---

## Step 3: Checkout Flow

### Option A: Stripe Checkout (Recommended for V1)

Use Stripe-hosted checkout pages for simplicity:

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_monthly_xxx', // Or selected tier price_id
    quantity: 1,
  }],
  success_url: 'https://rain.bxthre3.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://rain.bxthre3.com/pricing',
  metadata: {
    tier_id: 'monthly',
    referral_code: 'FARMER20'
  },
  subscription_data: {
    trial_period_days: 7
  }
});

// Redirect user to session.url
```

### Option B: Embedded Checkout (Future)
For embedded checkout directly on RAIN pages, use Stripe.js Elements.

---

## Step 4: Webhook Configuration

### Create Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://brodiblanco.zo.space/api/stripe-webhook`
3. Select events to listen for (see below)
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Required Webhook Events

| Event | Purpose |
|-------|---------|
| `checkout.session.completed` | New subscription started |
| `customer.subscription.created` | Track new subscriptions |
| `customer.subscription.updated` | Handle plan changes, upgrades |
| `customer.subscription.deleted` | Handle cancellations |
| `invoice.payment_succeeded` | Confirm payment received |
| `invoice.payment_failed` | Handle failed payments |
| `customer.subscription.trial_will_end` | Send trial ending reminder |

### Webhook Handler Implementation

```typescript
// /api/stripe-webhook
import type { Context } from "hono";
import Stripe from "stripe";

const processedEvents = new Map<string, number>();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

export default async (c: Context) => {
  const sig = c.req.header("stripe-signature");
  const body = await c.req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!sig || !webhookSecret) {
    return c.json({ error: "Missing signature or secret" }, 400);
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey || "", { 
      apiVersion: "2024-12-18.acacia" 
    });
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  // Idempotency check
  if (processedEvents.has(event.id)) {
    return c.json({ received: true, skipped: "already processed" });
  }
  processedEvents.set(event.id, Date.now());

  // Process event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCreated(subscription);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSuccess(invoice);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
  }

  return c.json({ received: true });
};

// Handler implementations
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // 1. Create/update subscriber record
  // 2. Send welcome email
  // 3. Grant access to tier features
  // 4. Trigger free report delivery if not already sent
  console.log("Checkout completed:", session.customer);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Update subscriber with subscription ID and status
  console.log("Subscription created:", subscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Handle tier changes, pauses, etc.
  console.log("Subscription updated:", subscription.id);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  // Mark subscriber as canceled, schedule data retention
  console.log("Subscription canceled:", subscription.id);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  // Update payment status, send receipt
  console.log("Payment succeeded:", invoice.id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Mark past due, send dunning email
  console.log("Payment failed:", invoice.id);
}
```

---

## Step 5: Customer Portal

Enable self-service subscription management:

```typescript
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://rain.bxthre3.com/account'
});

// Redirect to portalSession.url
```

Configure portal settings in Stripe Dashboard:
- Allow customers to update payment methods
- Allow plan upgrades/downgrades
- Allow cancellations with feedback flow

---

## Step 6: Testing Checklist

### Test Mode Verification

- [ ] Create test products and prices
- [ ] Complete test checkout with test card `4242 4242 4242 4242`
- [ ] Verify webhook events received
- [ ] Test trial period flow
- [ ] Test cancellation flow
- [ ] Test upgrade/downgrade flow
- [ ] Test payment failure with `4000 0000 0000 0002`
- [ ] Verify customer portal access

### Live Mode Deployment

- [ ] Switch to live API keys
- [ ] Recreate products/prices in live mode
- [ ] Update webhook endpoint to production
- [ ] Configure live customer portal
- [ ] Set up payment failure recovery emails
- [ ] Enable Stripe Tax (if applicable)

---

## API Reference

### Key Stripe Objects

| Object | RAIN Usage |
|--------|------------|
| `Customer` | One per subscriber |
| `Product` | One per tier (Monthly, Weekly, Daily, Quarterly) |
| `Price` | One per product + billing combination |
| `Subscription` | One active per paying subscriber |
| `Checkout.Session` | For initial signup conversion |
| `Invoice` | For payment tracking and receipts |

### Useful Stripe CLI Commands

```bash
# Listen to webhooks locally
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed

# List recent events
stripe events list --limit 10
```
