const express = require('express');
const router = express.Router();

// Subscription plans
router.get('/plans', (req, res) => {
  res.json({
    plans: [
      { id: 'standard', name: 'Standard', price: '₦5,000/year' },
      { id: 'premium', name: 'Premium', price: '₦7,000/year' },
      { id: 'ultimate', name: 'Ultimate', price: '₦15,000/year' },
      { id: 'family', name: 'Family', price: '₦20,000/year' }
    ]
  });
});

// User subscription status
router.get('/status/:userId', (req, res) => {
  res.json({
    status: 'Free Trial',
    expires: '2025-12-31'
  });
});

// Subscribe to a plan
router.post('/subscribe', (req, res) => {
  const { userId, planId } = req.body;
  res.json({
    message: `User ${userId} subscribed to ${planId} successfully`
  });
});

module.exports = router;
