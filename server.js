const express = require('express');
const Razorpay = require('razorpay');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_RIbMaNxFGal2Ba', // Your Test Key ID
  key_secret: 'Z9uqppanSlGCdtLsiv6cOxmN', // Your Test Key Secret
});

// Endpoint to create dynamic QR
app.post('/create-qr', async (req, res) => {
  const { amount, orderId } = req.body; // Amount from cart total, orderId unique

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // In paise (INR * 100)
      currency: 'INR',
      receipt: orderId,
      notes: { vending: 'CUTM-AP Machine' },
    });

    // Generate UPI intent string (using Razorpay's default VPA or customize with your VPA)
    const upiIntent = `upi://pay?pa=razor@axisbank&pn=CUTM-AP%20Vending&am=${amount}&cu=INR&tn=Vending%20Payment&tr=${order.id}`;

    // Generate QR as data URL
    const qrDataUrl = await QRCode.toDataURL(upiIntent);

    res.json({ qr: qrDataUrl, orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify payment status (for polling)
app.get('/verify-payment/:orderId', async (req, res) => {
  try {
    const order = await razorpay.orders.fetch(req.params.orderId);
    res.json({ status: order.status }); // 'paid' if successful
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for payment verification (optional for now, configure later)
app.post('/webhook', (req, res) => {
  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    const txnId = payload.payment.entity.id;
    const amount = payload.payment.entity.amount / 100;
    console.log(`Payment successful: ${txnId} for ${amount} INR`);
    // Add dispense logic here (e.g., hardware control) when ready
  }
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});