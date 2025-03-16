const express = require('express');
const router = express.Router();

// Mock donations packages
router.get('/packages', (req, res) => {
  res.json({
    packages: [
      { id: 'supporter', name: 'Supporter', minAmount: '₦5,000' },
      { id: 'sponsor', name: 'Sponsor', minAmount: '₦10,000' },
      { id: 'patron', name: 'Patron', minAmount: '₦20,000+' }
    ]
  });
});

// Make a donation
router.post('/donate', (req, res) => {
  const { userId, amount } = req.body;
  res.json({
    message: `User ${userId} donated ₦${amount} successfully`
  });
});

module.exports = router;
