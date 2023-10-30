const catchAsyncError = require("../middleware/catchAsyncError");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51KZZQ0SDmP6B2opgU2TnSfaMXfYfnA5vlTT3DUyRMjhsi6TEQn5KVV1AdRKExyx7eABAUL7kxfAwk1bT6kva2nf600yF0NuIZW"
);

//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
